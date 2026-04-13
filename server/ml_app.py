import os
import json
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
from xgboost import XGBClassifier
from sklearn.cluster import KMeans
import shap
import geopandas as gpd

app = Flask(__name__)
# Enable CORS for the frontend to communicate with this backend
CORS(app)

# Global variables to store trained models and data
data_df = None
rf_best = None
xgb_best = None
best_model = None
explainer = None
cluster_data = None
train_medians = None
existing_features = []

def initialize_model():
    global data_df, rf_best, xgb_best, best_model, explainer, cluster_data, train_medians, existing_features
    print("Initializing Machine Learning Models...")
    
    # 1. LOAD DATA (Adjust path as needed)
    data_path = 'Final_Cleaned_Panel_Dataset.csv'
    if not os.path.exists(data_path):
        print(f"Warning: {data_path} not found. Ensure the datasets are placed correctly.")
        return False
        
    df = pd.read_csv(data_path)
    data_df = df

    # 2. TARGET VARIABLE
    df['Flood_Occurred'] = ((df['Total_Flood_Events'] > 0) | (df['Indo_Event_Count'] > 0)).astype(int)

    # 3. FEATURES
    features = [
        'Annual_Tree_Loss_ha', 
        'Annual_Percent_Tree_Loss',
        'Annual_Rainfall', 
        'Monsoon_Rainfall', 
        'Max_Daily_Rainfall',
        'Lagged_Annual_Tree_Loss_ha', 
        'Lagged_Annual_Percent_Tree_Loss',
        'Lagged_Annual_Rainfall', 
        'Lagged_Monsoon_Rainfall'
    ]
    
    existing_features = [f for f in features if f in df.columns]

    # 4. TIME-BASED SPLIT
    train_df = df[df['Year'] <= 2018]
    test_df  = df[df['Year'] > 2018]

    X_train = train_df[existing_features]
    y_train = train_df['Flood_Occurred']

    X_test = test_df[existing_features]
    y_test = test_df['Flood_Occurred']

    # 5. SIMPLE IMPUTATION (SHAP-FRIENDLY)
    train_medians = X_train.median()
    X_train = X_train.fillna(train_medians)
    X_test  = X_test.fillna(train_medians)

    # 6. RANDOM FOREST (TUNING)
    print("Training Random Forest...")
    rf_params = {
        'n_estimators': [100],  # Reduced for faster startup in backend
        'max_depth': [5, 7],
        'min_samples_split': [2]
    }
    rf_grid = GridSearchCV(
        RandomForestClassifier(random_state=42),
        rf_params, cv=3, scoring='roc_auc', n_jobs=-1
    )
    rf_grid.fit(X_train, y_train)
    rf_best = rf_grid.best_estimator_

    # 7. XGBOOST (TUNING)
    print("Training XGBoost...")
    xgb_params = {
        'n_estimators': [100],
        'max_depth': [4, 5],
        'learning_rate': [0.05, 0.1],
        'subsample': [0.8]
    }
    xgb_grid = GridSearchCV(
        XGBClassifier(eval_metric='logloss', random_state=42),
        xgb_params, cv=3, scoring='roc_auc', n_jobs=-1
    )
    xgb_grid.fit(X_train, y_train)
    xgb_best = xgb_grid.best_estimator_

    # Evaluate to pick the best model
    rf_auc = roc_auc_score(y_test, rf_best.predict_proba(X_test)[:, 1])
    xgb_auc = roc_auc_score(y_test, xgb_best.predict_proba(X_test)[:, 1])
    
    best_model = xgb_best if xgb_auc > rf_auc else rf_best
    print(f"Best Model Selected: {type(best_model).__name__}")

    # Set up SHAP Explainer
    print("Setting up SHAP explainer...")
    explainer = shap.TreeExplainer(best_model)

    # 8. KMEANS CLUSTERING
    print("Running KMeans Clustering...")
    cluster_df = df.groupby("State")[["Annual_Rainfall", "Annual_Tree_Loss_ha", "Flood_Occurred"]].mean().fillna(0)
    kmeans = KMeans(n_clusters=3, random_state=42)
    cluster_df["Cluster"] = kmeans.fit_predict(cluster_df)
    cluster_data = cluster_df

    print("Initialization Complete!")
    return True

# Initialize model upon startup
is_initialized = initialize_model()

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "success", 
        "message": "Flood Risk ML Backend is running successfully! Please open the Vite React frontend (usually localhost:3000 or 5173) in your browser to view the application."
    })

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "status": "ready" if is_initialized else "missing_data",
        "message": "Model loaded successfully" if is_initialized else "Data file Final_Cleaned_Panel_Dataset.csv not found"
    })

@app.route('/api/predict', methods=['POST'])
def predict_risk():
    if not is_initialized:
        return jsonify({"error": "Model not initialized due to missing data"}), 500
        
    try:
        req_data = request.json
        # Expecting a list of features from frontend
        df_input = pd.DataFrame([req_data])
        
        # Ensure all existing features are mapped, missing filled with medians
        for col in existing_features:
            if col not in df_input.columns:
                df_input[col] = np.nan
        
        df_input = df_input[existing_features]
        df_input = df_input.fillna(train_medians)
        
        # Predict
        prob = best_model.predict_proba(df_input)[:, 1][0]
        prediction = int(best_model.predict(df_input)[0])

        # SHAP calculation for the single input
        shap_vals = explainer.shap_values(df_input)
        if isinstance(shap_vals, list):
            # RandomForest classification returns list
            shap_vals = shap_vals[1][0]
        else:
            shap_vals = shap_vals[0]
            
        feature_contributions = dict(zip(existing_features, shap_vals.tolist()))

        return jsonify({
            "risk_probability": float(prob),
            "will_flood": bool(prediction),
            "shap_contributions": feature_contributions
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/clusters', methods=['GET'])
def get_clusters():
    if not is_initialized or cluster_data is None:
        return jsonify({"error": "Model not initialized"}), 500
    
    # Return clustering info per state for the Risk Analytic dashboard
    result = cluster_data.reset_index().to_dict(orient='records')
    return jsonify({"clusters": result})

@app.route('/api/map_data', methods=['GET'])
def get_map_data():
    if not is_initialized:
        return jsonify({"error": "Model not initialized"}), 500
        
    shape_path = "gadm41_IND_1.shp"
    if not os.path.exists(shape_path):
        return jsonify({"error": "Shapefile gadm41_IND_1.shp not found"}), 404
        
    try:
        india_map = gpd.read_file(shape_path)
        
        # Aggregate true flood occurrence rates by state
        state_risk = data_df.groupby("State")['Flood_Occurred'].mean().reset_index()
        
        # Merge datasets (Assuming the shapefile has a 'NAME_1' or 'State' column)
        merge_col = "NAME_1" if "NAME_1" in india_map.columns else "State"
        merged = india_map.merge(state_risk, left_on=merge_col, right_on="State", how="left")
        
        # Convert to GeoJSON, replacing NaN with 0 for colors mapping
        merged['Flood_Occurred'] = merged['Flood_Occurred'].fillna(0)
        
        return merged.to_json()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/state_risk', methods=['GET'])
def get_state_risk():
    if not is_initialized:
        return jsonify({"error": "Model not initialized"}), 500
        
    try:
        state_risk = data_df.groupby("State").agg({
            'Flood_Occurred': 'mean',
            'Annual_Rainfall': 'mean',
            'Annual_Tree_Loss_ha': 'mean',
            'Total_Flood_Events': 'sum'
        }).reset_index()
        
        state_risk['riskScore'] = state_risk['Flood_Occurred'] * 10
        
        def get_risk_level(score):
            if score >= 8: return "Critical"
            if score >= 6: return "High"
            if score >= 4: return "Moderate"
            return "Low"
            
        state_risk['riskLevel'] = state_risk['riskScore'].apply(get_risk_level)
        
        state_risk = state_risk.rename(columns={
            'State': 'state',
            'Annual_Rainfall': 'rainfall',
            'Annual_Tree_Loss_ha': 'treeLoss'
        })
        
        state_risk['discharge'] = state_risk['rainfall'] * 10 
        state_risk['district'] = state_risk['state'] + " District"
        state_risk['lastUpdated'] = "2023-12-31"
        
        state_coords = {
            "Andhra Pradesh": {"latitude": 15.9129, "longitude": 79.7400},
            "Arunachal Pradesh": {"latitude": 28.2180, "longitude": 94.7278},
            "Assam": {"latitude": 26.2006, "longitude": 92.9376},
            "Bihar": {"latitude": 25.0961, "longitude": 85.3131},
            "Chhattisgarh": {"latitude": 21.2787, "longitude": 81.8661},
            "Goa": {"latitude": 15.2993, "longitude": 74.1240},
            "Gujarat": {"latitude": 22.2587, "longitude": 71.1924},
            "Haryana": {"latitude": 29.0588, "longitude": 76.0856},
            "Himachal Pradesh": {"latitude": 31.1048, "longitude": 77.1665},
            "Jharkhand": {"latitude": 23.6102, "longitude": 85.2799},
            "Karnataka": {"latitude": 15.3173, "longitude": 75.7139},
            "Kerala": {"latitude": 10.8505, "longitude": 76.2711},
            "Madhya Pradesh": {"latitude": 22.9734, "longitude": 78.6569},
            "Maharashtra": {"latitude": 19.7515, "longitude": 75.7139},
            "Manipur": {"latitude": 24.6637, "longitude": 93.9063},
            "Meghalaya": {"latitude": 25.4670, "longitude": 91.3662},
            "Mizoram": {"latitude": 23.1645, "longitude": 92.9376},
            "Nagaland": {"latitude": 26.1584, "longitude": 94.5624},
            "Odisha": {"latitude": 20.9517, "longitude": 85.0985},
            "Punjab": {"latitude": 31.1471, "longitude": 75.3412},
            "Rajasthan": {"latitude": 27.0238, "longitude": 74.2179},
            "Sikkim": {"latitude": 27.5330, "longitude": 88.5122},
            "Tamil Nadu": {"latitude": 11.1271, "longitude": 78.6569},
            "Tripura": {"latitude": 23.9408, "longitude": 91.9882},
            "Uttar Pradesh": {"latitude": 26.8467, "longitude": 80.9462},
            "Uttarakhand": {"latitude": 30.0668, "longitude": 79.0193},
            "West Bengal": {"latitude": 22.9868, "longitude": 87.8550},
            "Delhi": {"latitude": 28.7041, "longitude": 77.1025},
            "Chandigarh": {"latitude": 30.7333, "longitude": 76.7794},
            "Dadra & Nagar Haveli & Daman & Diu": {"latitude": 20.1809, "longitude": 73.0169}
        }
        
        state_list = []
        for _, row in state_risk.iterrows():
            st = row['state']
            if st in state_coords:
                row_dict = row.to_dict()
                row_dict['latitude'] = state_coords[st]['latitude']
                row_dict['longitude'] = state_coords[st]['longitude']
                row_dict['id'] = st
                row_dict['name'] = st
                state_list.append(row_dict)
                
        return jsonify({"locations": state_list})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/shap_summary', methods=['GET'])
def shap_summary():
    if not is_initialized:
        return jsonify({"error": "Model not initialized"}), 500
        
    try:
        sample_df = data_df[existing_features].fillna(train_medians).sample(min(1000, len(data_df)))
        shap_vals = explainer.shap_values(sample_df)
        
        if isinstance(shap_vals, list):
            shap_vals = shap_vals[1]
        
        # New SHAP library might return 3D arrays (samples, features, classes) for Random Forest
        if hasattr(shap_vals, "ndim") and shap_vals.ndim == 3:
            shap_vals = shap_vals[:, :, -1]
            
        mean_abs_shap = np.abs(shap_vals).mean(axis=0)
        
        # Safeguard calculation
        total_importance = float(np.sum(mean_abs_shap))
        importance = dict(zip(existing_features, mean_abs_shap.tolist()))
        
        sorted_imp = sorted(importance.items(), key=lambda x: x[1], reverse=True)
        
        shap_data = []
        colors = ['#06b6d4', '#0891b2', '#0e7490', '#164e63', '#0c4a6e', '#082f36', '#0f766e', '#115e59', '#134e4a']
        for i, (feat, val) in enumerate(sorted_imp):
            shap_data.append({
                "feature": feat.replace("_", " "),
                "importance": float(val / total_importance) if total_importance > 0 else 0,
                "color": colors[min(i, len(colors)-1)]
            })
            
        return jsonify({"shap_data": shap_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, port=5000)
