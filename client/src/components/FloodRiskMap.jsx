import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function FloodRiskMap() {
  const [selectedState, setSelectedState] = useState(null);
  const [stateData, setStateData] = useState([]);

  // Sample data - replace with your actual model predictions
  const sampleStateData = [
    { state: 'Assam', riskLevel: 'Critical', riskScore: 8.5, districts: 33, lastUpdated: '2024-04-03' },
    { state: 'Bihar', riskLevel: 'High', riskScore: 7.8, districts: 38, lastUpdated: '2024-04-03' },
    { state: 'Odisha', riskLevel: 'High', riskScore: 7.2, districts: 30, lastUpdated: '2024-04-03' },
    { state: 'West Bengal', riskLevel: 'High', riskScore: 7.0, districts: 23, lastUpdated: '2024-04-03' },
    { state: 'Maharashtra', riskLevel: 'Moderate', riskScore: 5.9, districts: 36, lastUpdated: '2024-04-03' },
    { state: 'Uttar Pradesh', riskLevel: 'Moderate', riskScore: 5.2, districts: 75, lastUpdated: '2024-04-03' },
    { state: 'Madhya Pradesh', riskLevel: 'Low', riskScore: 4.1, districts: 52, lastUpdated: '2024-04-03' },
    { state: 'Karnataka', riskLevel: 'Low', riskScore: 3.8, districts: 31, lastUpdated: '2024-04-03' },
  ];

  useEffect(() => {
    setStateData(sampleStateData);
  }, []);

  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-500 hover:bg-red-600';
      case 'High':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'Moderate':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'Low':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-400';
    }
  };

  const getRiskBadgeColor = (level) => {
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
    <div className="space-y-6">
      {/* Map Legend */}
      <Card className="p-4 border border-border shadow-sm bg-secondary">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">Risk Level Guide</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-xs text-muted-foreground">Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="text-xs text-muted-foreground">Moderate Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-xs text-muted-foreground">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-xs text-muted-foreground">Critical Risk</span>
          </div>
        </div>
      </Card>

      {/* Interactive State Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {stateData.map((state) => (
          <button
            key={state.state}
            onClick={() => setSelectedState(selectedState === state.state ? null : state.state)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedState === state.state
                ? 'border-accent bg-accent/10'
                : 'border-border hover:border-accent/50'
            } ${getRiskColor(state.riskLevel)} text-white shadow-sm hover:shadow-md`}
          >
            <p className="font-semibold text-sm">{state.state}</p>
            <p className="text-xs opacity-90 mt-1">{state.riskLevel}</p>
            <p className="text-xs opacity-75 mt-1">Score: {state.riskScore.toFixed(1)}</p>
          </button>
        ))}
      </div>

      {/* State Details Panel */}
      {selectedState && (
        <Card className="p-6 border border-border shadow-sm">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{selectedState}</h3>
                <p className="text-sm text-muted-foreground mt-1">Detailed flood risk analysis</p>
              </div>
              <button
                onClick={() => setSelectedState(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            {stateData.find((s) => s.state === selectedState) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-secondary rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                  <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskBadgeColor(
                    stateData.find((s) => s.state === selectedState)?.riskLevel || 'Low'
                  )}`}>
                    {stateData.find((s) => s.state === selectedState)?.riskLevel}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stateData.find((s) => s.state === selectedState)?.riskScore.toFixed(1)}/10
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Districts</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stateData.find((s) => s.state === selectedState)?.districts}
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 bg-secondary rounded-lg border border-border">
              <p className="text-sm font-semibold text-foreground mb-2">Key Factors</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  High rainfall during monsoon season
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Significant river discharge patterns
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Environmental degradation impact
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Historical flood frequency
                </li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Data Table */}
      <Card className="p-6 border border-border shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold text-foreground mb-4">All States Risk Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-4 py-3 text-left font-semibold text-foreground">State</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Risk Level</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Score</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Districts</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {stateData.map((state) => (
                <tr
                  key={state.state}
                  className="border-b border-border hover:bg-secondary transition-colors cursor-pointer"
                  onClick={() => setSelectedState(state.state)}
                >
                  <td className="px-4 py-3 font-medium text-foreground">{state.state}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(state.riskLevel)}`}>
                      {state.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{state.riskScore.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{state.districts}</td>
                  <td className="px-4 py-3 text-muted-foreground">{state.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
