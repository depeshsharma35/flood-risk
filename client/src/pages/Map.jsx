import DashboardLayout from '@/components/DashboardLayout';
import GeographicFloodMap from '@/components/GeographicFloodMap';

export default function MapPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <section className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Flood Risk Map</h1>
          <p className="text-muted-foreground">
            Interactive geographic visualization of flood risk across India with real-time monitoring stations
          </p>
        </section>

        {/* Map Section */}
        <section className="space-y-4">
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 lg:p-8">
              <h2 className="section-header">Real-time Flood Risk Monitoring</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Click on any marker to view detailed flood risk information. The map shows monitored locations across India with color-coded risk levels based on current environmental conditions and predictions.
              </p>
              <GeographicFloodMap />
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">How to Use This Map</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">1</span>
                <span>Click on any marker to view detailed flood risk information for that location</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">2</span>
                <span>Use the legend to understand risk levels (color-coded from green to red)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">3</span>
                <span>Zoom and pan the map to explore different regions of India</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">4</span>
                <span>Check the monitored locations list below the map for quick access</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Risk Level Interpretation</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-semibold text-green-900 text-sm">Low Risk</p>
                <p className="text-xs text-green-800 mt-1">Minimal flood threat; routine monitoring sufficient</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-semibold text-amber-900 text-sm">Moderate Risk</p>
                <p className="text-xs text-amber-800 mt-1">Elevated risk; enhanced preparedness recommended</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="font-semibold text-orange-900 text-sm">High Risk</p>
                <p className="text-xs text-orange-800 mt-1">Significant threat; active monitoring and alert status</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-red-900 text-sm">Critical Risk</p>
                <p className="text-xs text-red-800 mt-1">Severe threat; emergency protocols activated</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="bg-secondary border border-border rounded-lg p-6 lg:p-8">
          <h3 className="font-semibold text-foreground mb-4">Data Sources & Update Frequency</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-foreground mb-2">Meteorological Data</p>
              <p className="text-muted-foreground">Updated daily from IMD weather stations and satellite data</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2">Historical Records</p>
              <p className="text-muted-foreground">Integrated from IndoFloods database (1950-present)</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2">Environmental Data</p>
              <p className="text-muted-foreground">Satellite imagery and land cover analysis updated monthly</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
