import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import GeographicFloodMap from '@/components/GeographicFloodMap';
import { useState } from 'react';

const FEATURE_DEFS = [
  { key: 'Annual_Rainfall', label: 'Annual Rainfall (mm)', placeholder: 'e.g., 1800' },
  { key: 'Monsoon_Rainfall', label: 'Monsoon Rainfall (mm)', placeholder: 'e.g., 1500' },
  { key: 'Max_Daily_Rainfall', label: 'Max Daily Rainfall (mm)', placeholder: 'e.g., 150' },
  { key: 'Annual_Tree_Loss_ha', label: 'Annual Tree Loss (ha)', placeholder: 'e.g., 4500' },
  { key: 'Annual_Percent_Tree_Loss', label: 'Annual Tree Loss (%)', placeholder: 'e.g., 4.5' },
  { key: 'Lagged_Annual_Rainfall', label: 'Lagged Annual Rainfall (mm)', placeholder: 'Previous year sum' },
  { key: 'Lagged_Monsoon_Rainfall', label: 'Lagged Monsoon Rainfall (mm)', placeholder: 'Previous year sum' },
  { key: 'Lagged_Annual_Tree_Loss_ha', label: 'Lagged Tree Loss (ha)', placeholder: 'Previous year tree loss' },
  { key: 'Lagged_Annual_Percent_Tree_Loss', label: 'Lagged Tree Loss (%)', placeholder: 'Previous year %' },
];

export default function Prediction() {
  const [formData, setFormData] = useState({
    Annual_Tree_Loss_ha: '',
    Annual_Percent_Tree_Loss: '',
    Annual_Rainfall: '',
    Monsoon_Rainfall: '',
    Max_Daily_Rainfall: '',
    Lagged_Annual_Tree_Loss_ha: '',
    Lagged_Annual_Percent_Tree_Loss: '',
    Lagged_Annual_Rainfall: '',
    Lagged_Monsoon_Rainfall: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build payload where empty strings become nulls to trigger median imputations in backend if needed
      const payload = {};
      for (const key of FEATURE_DEFS.map(f => f.key)) {
        payload[key] = formData[key] === '' ? null : parseFloat(formData[key]);
      }

      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Prediction API failed to respond properly');
      }

      const data = await res.json();

      const prob = data.risk_probability * 100;
      let riskLevel = 'Low';
      if (prob >= 80) riskLevel = 'Critical';
      else if (prob >= 50) riskLevel = 'High';
      else if (prob >= 25) riskLevel = 'Moderate';

      // Parse SHAP contributions dynamically from backend
      const shapEntries = Object.entries(data.shap_contributions || {}).map(([factor, rawContrib]) => {
        // If SHAP returns an array per feature [class0_impact, class1_impact], use class1.
        const contrib = Array.isArray(rawContrib) ? rawContrib[rawContrib.length - 1] : rawContrib;
        
        return {
          factor: factor.replace(/_/g, ' '),
          contribution: contrib,
          impact: contrib > 0 ? 'positive' : 'negative',
          absContrib: Math.abs(contrib)
        };
      });

      // Sort by greatest impact
      shapEntries.sort((a, b) => b.absContrib - a.absContrib);

      // Determine max SHAP range to properly scale UI bars
      const maxContrib = Math.max(...shapEntries.map(s => s.absContrib), 0.001);

      const predictionObj = {
        riskLevel,
        probability: prob,
        shap: shapEntries.slice(0, 6).map(s => ({
          ...s,
          scaledWidth: (s.absContrib / maxContrib) * 100
        })),
        inputs: formData
      };
      
      setPrediction(predictionObj);
      sessionStorage.setItem('lastPrediction', JSON.stringify(predictionObj));
    } catch (err) {
      console.error(err);
      alert('Error fetching prediction. Is the ML backend running effectively?');
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'Critical':
        return <AlertCircle className="w-8 h-8 text-red-600" />;
      case 'High':
        return <AlertTriangle className="w-8 h-8 text-orange-600" />;
      case 'Moderate':
        return <Info className="w-8 h-8 text-amber-600" />;
      case 'Low':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      default:
        return null;
    }
  };

  const getRiskBgColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'risk-critical';
      case 'High':
        return 'risk-high';
      case 'Moderate':
        return 'risk-moderate';
      case 'Low':
        return 'risk-low';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <section className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Flood Risk Prediction</h1>
          <p className="text-muted-foreground">
            Input accurate environmental parameters to run the live Machine Learning model
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 border border-border shadow-sm sticky top-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Input Parameters</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 pb-2">
                  {FEATURE_DEFS.map((feature) => (
                    <div key={feature.key}>
                      <Label htmlFor={feature.key} className="text-sm font-medium text-foreground mb-1 block">
                        {feature.label}
                      </Label>
                      <Input
                        id={feature.key}
                        name={feature.key}
                        type="number"
                        placeholder={feature.placeholder}
                        step="any"
                        value={formData[feature.key]}
                        onChange={handleInputChange}
                        required
                        className="border border-border bg-background text-foreground"
                      />
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold border-0 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {loading ? 'Analyzing via Real ML APIs...' : 'Predict Risk'}
                </Button>
              </form>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Note:</strong> This uses live XenBoost and Random Forest architectures running natively on our Python / Flask API endpoints.
                </p>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {prediction ? (
              <>
                {/* Risk Level Card */}
                <Card className={`p-8 border shadow-sm ${getRiskBgColor(prediction.riskLevel)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold opacity-75 mb-2">Predicted Risk Level</p>
                      <h2 className="text-4xl font-bold">{prediction.riskLevel}</h2>
                    </div>
                    {getRiskIcon(prediction.riskLevel)}
                  </div>
                  <div className="mt-6">
                    <p className="text-sm font-semibold opacity-75 mb-2">Confidence Score (Flood Probability)</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-black/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-teal-600 transition-all duration-500"
                          style={{ width: `${prediction.probability}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-lg">{prediction.probability.toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>

                {/* Risk Interpretation */}
                <Card className="p-6 border border-border shadow-sm">
                  <h3 className="font-semibold text-foreground mb-4">Risk Interpretation</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    {prediction.riskLevel === 'Critical' && (
                      <>
                        <p>
                          <strong>Immediate Action Required:</strong> Current conditions indicate extremely high flood risk. Emergency preparedness measures should be activated immediately.
                        </p>
                        <p>
                          <strong>Recommendations:</strong> Issue flood alerts, prepare evacuation routes, and mobilize disaster management resources.
                        </p>
                      </>
                    )}
                    {prediction.riskLevel === 'High' && (
                      <>
                        <p>
                          <strong>High Alert Status:</strong> Significant flood risk detected. Enhanced monitoring and preparedness are essential.
                        </p>
                        <p>
                          <strong>Recommendations:</strong> Increase surveillance, prepare contingency plans, and alert vulnerable communities.
                        </p>
                      </>
                    )}
                    {prediction.riskLevel === 'Moderate' && (
                      <>
                        <p>
                          <strong>Elevated Risk:</strong> Moderate flood risk present. Standard precautions should be maintained.
                        </p>
                        <p>
                          <strong>Recommendations:</strong> Continue monitoring, maintain drainage systems, and keep emergency protocols ready.
                        </p>
                      </>
                    )}
                    {prediction.riskLevel === 'Low' && (
                      <>
                        <p>
                          <strong>Low Risk Status:</strong> Current conditions suggest minimal flood risk. Routine monitoring continues.
                        </p>
                        <p>
                          <strong>Recommendations:</strong> Maintain regular monitoring and continue preventive maintenance activities.
                        </p>
                      </>
                    )}
                  </div>
                </Card>

                {/* SHAP Explainability */}
                <Card className="p-6 border border-border shadow-sm">
                  <h3 className="font-semibold text-foreground mb-4">SHAP Explainability Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    How each factor contributed to the prediction natively from Python APIs:
                  </p>
                  <div className="space-y-4">
                    {prediction.shap.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{item.factor}</span>
                          <span className={`text-sm font-semibold ${item.impact === 'positive'
                              ? 'text-red-600'
                              : item.impact === 'negative'
                                ? 'text-green-600'
                                : 'text-gray-600'
                            }`}>
                            {item.impact === 'positive' ? '+' : item.impact === 'negative' ? '−' : ''}
                            {item.contribution.toFixed(3)}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${item.impact === 'positive'
                                ? 'bg-gradient-to-r from-orange-400 to-red-500'
                                : 'bg-gradient-to-r from-green-400 to-emerald-500'
                              }`}
                            style={{ width: `${item.scaledWidth}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Model Details */}
                <Card className="p-6 border border-border shadow-sm">
                  <h3 className="font-semibold text-foreground mb-4">Model Ensemble Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Random Forest</p>
                      <p className="font-semibold text-foreground">Feature Importance</p>
                      <p className="text-xs text-muted-foreground mt-1">Captures non-linear patterns</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">XGBoost</p>
                      <p className="font-semibold text-foreground">Gradient Boosting</p>
                      <p className="text-xs text-muted-foreground mt-1">High accuracy predictions</p>
                    </div>
                  </div>
                </Card>

                {/* Global SHAP & Map Context */}
                <Card className="p-6 border border-border shadow-sm">
                  <h3 className="font-semibold text-foreground mb-4">Historical Regional Risk Map</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    See how your current prediction aligns with data across India visually based on historical context.
                  </p>
                  <GeographicFloodMap />
                </Card>
              </>
            ) : (
              <Card className="p-12 border border-border shadow-sm text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-secondary rounded-lg mx-auto flex items-center justify-center">
                    <Info className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Ready to Predict</h3>
                  <p className="text-muted-foreground">
                    Fill in the highly detailed parameters on the left and click "Predict Risk" to hit the actual Python model backend via our internal API proxy.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
