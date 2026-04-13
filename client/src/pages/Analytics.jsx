import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Analytics() {
  const [shapeData, setShapeData] = useState([]);
  const [stateRiskData, setStateRiskData] = useState([]);

  useEffect(() => {
    // Check if the user ran a prediction recently
    const savedPrediction = sessionStorage.getItem('lastPrediction');
    
    if (savedPrediction) {
      const prediction = JSON.parse(savedPrediction);
      const formattedShap = prediction.shap.map(s => ({
        feature: s.factor,
        importance: s.absContrib,
        color: s.impact === 'positive' ? '#ef4444' : '#10b981'
      }));
      setShapeData(formattedShap);
    } else {
      // Fetch global SHAP summary
      fetch('/api/shap_summary')
        .then(res => res.json())
        .then(data => {
          if(data.shap_data) {
            setShapeData(data.shap_data.slice(0, 6));
          }
        })
        .catch(console.error);
    }

    // Fetch State risk data from our dataset
    fetch('/api/state_risk')
      .then(res => res.json())
      .then(data => {
        if(data.locations) {
          const sorted = data.locations.sort((a, b) => b.riskScore - a.riskScore).slice(0, 8);
          setStateRiskData(sorted.map(loc => ({
            state: loc.state,
            risk: loc.riskScore
          })));
        }
      })
      .catch(console.error);
  }, []);

  // Temporal trend
  const temporalData = [
    { month: 'Jan', risk: 2.1 },
    { month: 'Feb', risk: 2.3 },
    { month: 'Mar', risk: 2.8 },
    { month: 'Apr', risk: 3.5 },
    { month: 'May', risk: 4.2 },
    { month: 'Jun', risk: 6.8 },
    { month: 'Jul', risk: 7.9 },
    { month: 'Aug', risk: 8.1 },
    { month: 'Sep', risk: 7.2 },
    { month: 'Oct', risk: 5.1 },
    { month: 'Nov', risk: 3.2 },
    { month: 'Dec', risk: 2.4 },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <section className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Risk Analytics</h1>
          <p className="text-muted-foreground">
            Explainable AI insights into flood risk factors and patterns
          </p>
        </section>

        {/* SHAP Feature Importance */}
        <section className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-sm">
          <div className="space-y-4 mb-6">
            <h2 className="section-header">SHAP Feature Importance</h2>
            <p className="text-sm text-muted-foreground">
              These features have the strongest influence on flood risk predictions. SHAP (SHapley Additive exPlanations) values show how each factor contributes to the model's decisions.
            </p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shapeData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="feature" type="category" stroke="#64748b" width={190} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                  formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                />
                <Bar dataKey="importance" fill="#06b6d4" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Feature Insights */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-3">Rainfall Factors (50.3%)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Annual and lagged rainfall are the strongest predictors. Recent rainfall patterns combined with historical trends provide the most reliable flood risk signals.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><strong>Annual Rainfall:</strong> 28.5% - Current season precipitation</p>
              <p><strong>Lagged Rainfall:</strong> 21.8% - Previous period patterns</p>
            </div>
          </Card>

          <Card className="p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-3">Hydrological Factors (28.4%)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Peak discharge and catchment area characteristics determine water flow capacity. Larger catchments with high discharge rates indicate greater flood potential.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><strong>Peak Discharge:</strong> 19.5% - Maximum water flow rates</p>
              <p><strong>Catchment Area:</strong> 8.9% - Drainage basin size</p>
            </div>
          </Card>

          <Card className="p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-3">Environmental Factors (21.3%)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Deforestation and land cover loss reduce water infiltration and increase runoff. Tree loss directly correlates with increased flood severity.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><strong>Tree Loss %:</strong> 15.6% - Deforestation rate</p>
              <p><strong>Land Cover:</strong> 5.7% - Vegetation density</p>
            </div>
          </Card>

          <Card className="p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-3">Model Performance</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our ensemble approach combines Random Forest, XGBoost, and SARIMAX to capture both spatial patterns and temporal trends with high accuracy.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><strong>Random Forest:</strong> Handles non-linear relationships</p>
              <p><strong>XGBoost:</strong> Captures complex interactions</p>
              <p><strong>SARIMAX:</strong> Forecasts temporal patterns</p>
            </div>
          </Card>
        </section>

        {/* State-wise Risk Distribution */}
        <section className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-sm">
          <div className="space-y-4 mb-6">
            <h2 className="section-header">State-wise Flood Risk Index</h2>
            <p className="text-sm text-muted-foreground">
              Risk index (0-10 scale) showing vulnerability across Indian states based on historical data and current conditions.
            </p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateRiskData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="state" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                  formatter={(value) => `Risk: ${Number(value).toFixed(1)}`}
                />
                <Bar dataKey="risk" fill="#0891b2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Temporal Risk Pattern */}
        <section className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-sm">
          <div className="space-y-4 mb-6">
            <h2 className="section-header">Seasonal Risk Pattern</h2>
            <p className="text-sm text-muted-foreground">
              Average flood risk across months, showing peak monsoon season vulnerability (June-September).
            </p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temporalData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                  formatter={(value) => `Risk: ${Number(value).toFixed(1)}`}
                />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="#06b6d4"
                  dot={{ fill: '#0891b2', r: 4 }}
                  strokeWidth={2}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Key Insights */}
        <section className="bg-secondary border border-border rounded-lg p-6 lg:p-8">
          <h2 className="font-semibold text-foreground mb-4">Key Insights</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
              <span><strong>Rainfall Dominance:</strong> Over 50% of prediction power comes from rainfall patterns, emphasizing the need for accurate meteorological data.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
              <span><strong>Environmental Impact:</strong> Tree loss and deforestation significantly amplify flood risk, making conservation critical.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
              <span><strong>Seasonal Concentration:</strong> June-September monsoon season shows 3-4x higher risk than dry months.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
              <span><strong>Regional Variation:</strong> Northeastern states (Assam, Meghalaya) show consistently higher vulnerability due to geography and rainfall patterns.</span>
            </li>
          </ul>
        </section>
      </div>
    </DashboardLayout>
  );
}
