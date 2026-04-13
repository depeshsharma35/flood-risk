import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dataset() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [floodData, setFloodData] = useState([]);

  useEffect(() => {
    fetch('/api/state_risk')
      .then(res => res.json())
      .then(data => {
        if(data.locations) {
          const records = data.locations.map((loc, idx) => ({
            id: idx + 1,
            state: loc.state,
            district: loc.district,
            date: loc.lastUpdated,
            rainfall: loc.rainfall,
            discharge: loc.discharge,
            treeLoss: loc.treeLoss,
            riskLevel: loc.riskLevel,
            description: `Average recorded floods: ${loc.Total_Flood_Events}. Historical dataset aggregated across varying topographies.`
          }));
          setFloodData(records);
        }
      })
      .catch(console.error);
  }, []);

  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <section className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Dataset Overview</h1>
          <p className="text-muted-foreground">
            Integrated flood-related data from multiple sources across India
          </p>
        </section>

        {/* Data Sources */}
        <section className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-sm">
          <h2 className="section-header">Data Sources & Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-2">IndoFloods Database</h3>
              <p className="text-sm text-muted-foreground">
                Historical flood events, impacts, and casualties from 1950-present
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-2">Meteorological Data</h3>
              <p className="text-sm text-muted-foreground">
                Daily rainfall, temperature, and weather patterns from IMD stations
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-2">Environmental Data</h3>
              <p className="text-sm text-muted-foreground">
                Tree loss, land cover, vegetation indices from satellite imagery
              </p>
            </div>
          </div>
        </section>

        {/* Dataset Statistics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border border-border shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">Total Records</p>
            <p className="text-3xl font-bold text-foreground">100,000+</p>
            <p className="text-xs text-muted-foreground mt-2">Data points across all sources</p>
          </Card>
          <Card className="p-6 border border-border shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">Time Period</p>
            <p className="text-3xl font-bold text-foreground">73 Years</p>
            <p className="text-xs text-muted-foreground mt-2">1950 to 2023</p>
          </Card>
          <Card className="p-6 border border-border shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">Geographic Coverage</p>
            <p className="text-3xl font-bold text-foreground">28 States</p>
            <p className="text-xs text-muted-foreground mt-2">All major flood-prone regions</p>
          </Card>
          <Card className="p-6 border border-border shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">Features</p>
            <p className="text-3xl font-bold text-foreground">45+</p>
            <p className="text-xs text-muted-foreground mt-2">Engineered variables</p>
          </Card>
        </section>

        {/* Data Table */}
        <section className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Recent Flood Events</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sample records from the integrated dataset showing state, district, rainfall, discharge, and risk assessment
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-6 py-3 text-left font-semibold text-foreground">State</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">District</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Rainfall (mm)</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Discharge (m³/s)</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Tree Loss %</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Risk Level</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Details</th>
                </tr>
              </thead>
              <tbody>
                {floodData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border hover:bg-secondary transition-colors ${
                      expandedRow === idx ? 'bg-secondary' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">{row.state}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.district}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.date}</td>
                    <td className="px-6 py-4 text-right font-mono text-foreground">{row.rainfall.toFixed(1)}</td>
                    <td className="px-6 py-4 text-right font-mono text-foreground">{row.discharge.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-mono text-foreground">{row.treeLoss.toFixed(1)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(row.riskLevel)}`}>
                        {row.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                        className="p-1 hover:bg-border rounded transition-colors"
                      >
                        <ChevronDown
                          className={`w-5 h-5 text-muted-foreground transition-transform ${
                            expandedRow === idx ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded Row Details */}
          {expandedRow !== null && (
            <div className="border-t border-border bg-secondary p-6">
              <div className="max-w-2xl">
                <h3 className="font-semibold text-foreground mb-3">Event Details</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {floodData[expandedRow].description}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">
                      {floodData[expandedRow].district}, {floodData[expandedRow].state}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-semibold text-foreground">{floodData[expandedRow].date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Peak Discharge</p>
                    <p className="font-semibold text-foreground font-mono">
                      {floodData[expandedRow].discharge.toLocaleString()} m³/s
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Deforestation Rate</p>
                    <p className="font-semibold text-foreground font-mono">{floodData[expandedRow].treeLoss.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Data Quality & Features */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Data Quality Metrics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completeness</span>
                <span className="font-semibold text-foreground">98.5%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-600 w-[98.5%]"></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Validation</span>
                <span className="font-semibold text-foreground">99.2%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-600 w-[99.2%]"></div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Key Variables</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Annual & lagged rainfall (mm)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Peak discharge (m³/s)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Catchment area (km²)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Tree loss percentage
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Land cover classification
              </li>
            </ul>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
