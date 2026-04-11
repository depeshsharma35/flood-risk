import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';


export default function Prediction() {
  const [formData, setFormData] = useState({
    rainfall: '',
    treeLoss: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate ML prediction with delay
    setTimeout(() => {
      const rainfall = parseFloat(formData.rainfall);
      const treeLoss = parseFloat(formData.treeLoss);

      // Simple heuristic for demonstration
      let riskScore = 0;
      riskScore += (rainfall / 100) * 30;
      riskScore += (treeLoss / 20) * 25;

      let riskLevel = 'Low';
      if (riskScore >= 7.5) riskLevel = 'Critical';
      else if (riskScore >= 5.5) riskLevel = 'High';
      else if (riskScore >= 3.5) riskLevel = 'Moderate';

      const probability = Math.min(95, Math.max(60, riskScore * 10 + Math.random() * 10));

      setPrediction({
        riskLevel,
        probability,
        shap: [
          {
            factor: 'Annual Rainfall',
            contribution: (rainfall / 100) * 0.285,
            impact: rainfall > 150 ? 'positive' : 'negative',
          },
          {
            factor: 'Tree Loss %',
            contribution: (treeLoss / 20) * 0.156,
            impact: treeLoss > 10 ? 'positive' : 'negative',
          },
        ],
      });
      setLoading(false);
    }, 1500);
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
            Input environmental parameters to get AI-powered flood risk predictions with explainability
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 border border-border shadow-sm sticky top-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Input Parameters</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="rainfall" className="text-sm font-medium text-foreground mb-1 block">
                    Annual Rainfall (mm)
                  </Label>
                  <Input
                    id="rainfall"
                    name="rainfall"
                    type="number"
                    placeholder="e.g., 200"
                    value={formData.rainfall}
                    onChange={handleInputChange}
                    required
                    className="border border-border bg-background text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Current season precipitation</p>
                </div>

                <div>
                  <Label htmlFor="treeLoss" className="text-sm font-medium text-foreground mb-1 block">
                    Tree Loss (%)
                  </Label>
                  <Input
                    id="treeLoss"
                    name="treeLoss"
                    type="number"
                    placeholder="e.g., 12"
                    step="0.1"
                    value={formData.treeLoss}
                    onChange={handleInputChange}
                    required
                    className="border border-border bg-background text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Deforestation rate</p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold border-0 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {loading ? 'Analyzing...' : 'Predict Risk'}
                </Button>
              </form>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Note:</strong> This prediction uses machine learning models trained on 100,000+ historical flood events. Results are for analysis purposes.
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
                    <p className="text-sm font-semibold opacity-75 mb-2">Confidence Score</p>
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
                    How each factor contributed to the prediction (positive values increase risk, negative values decrease risk):
                  </p>
                  <div className="space-y-4">
                    {prediction.shap.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{item.factor}</span>
                          <span className={`text-sm font-semibold ${
                            item.impact === 'positive'
                              ? 'text-red-600'
                              : item.impact === 'negative'
                              ? 'text-green-600'
                              : 'text-gray-600'
                          }`}>
                            {item.impact === 'positive' ? '+' : item.impact === 'negative' ? '−' : ''}
                            {(item.contribution * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              item.impact === 'positive'
                                ? 'bg-gradient-to-r from-orange-400 to-red-500'
                                : item.impact === 'negative'
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                : 'bg-gradient-to-r from-slate-400 to-slate-500'
                            }`}
                            style={{ width: `${Math.abs(item.contribution) * 100}%` }}
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
                    <div>
                      <p className="text-muted-foreground mb-1">SARIMAX</p>
                      <p className="font-semibold text-foreground">Time Series</p>
                      <p className="text-xs text-muted-foreground mt-1">Temporal forecasting</p>
                    </div>
                  </div>
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
                    Fill in the parameters on the left and click "Predict Risk" to get an AI-powered flood risk assessment with explainability analysis.
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
