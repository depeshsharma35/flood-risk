import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';

// Custom marker component
function CustomMarker({ location, onMarkerClick }) {
  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical':
        return '#dc2626';
      case 'High':
        return '#ea580c';
      case 'Moderate':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const icon = L.divIcon({
    html: `
      <div style="
        background-color: ${getRiskColor(location.riskLevel)};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    className: 'custom-marker',
  });

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onMarkerClick(location),
      }}
    >
      <Popup>
        <div className="text-sm">
          <p className="font-semibold">{location.name}</p>
          <p className="text-xs text-gray-600">{location.state}</p>
          <p className="text-xs font-semibold mt-1" style={{ color: getRiskColor(location.riskLevel) }}>
            Risk: {location.riskLevel}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

export default function GeographicFloodMap({ onMarkerClick }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Sample flood locations across India
  const floodLocations = [
    {
      id: '1',
      name: 'Barpeta District',
      state: 'Assam',
      district: 'Barpeta',
      latitude: 26.3,
      longitude: 90.2,
      riskLevel: 'Critical',
      riskScore: 8.5,
      rainfall: 245.8,
      discharge: 8500,
      treeLoss: 12.5,
      lastUpdated: '2024-04-03',
    },
    {
      id: '2',
      name: 'Muzaffarpur District',
      state: 'Bihar',
      district: 'Muzaffarpur',
      latitude: 26.5,
      longitude: 85.4,
      riskLevel: 'High',
      riskScore: 7.8,
      rainfall: 198.3,
      discharge: 6200,
      treeLoss: 8.3,
      lastUpdated: '2024-04-03',
    },
    {
      id: '3',
      name: 'Balasore District',
      state: 'Odisha',
      district: 'Balasore',
      latitude: 21.5,
      longitude: 87.3,
      riskLevel: 'High',
      riskScore: 7.2,
      rainfall: 156.7,
      discharge: 4800,
      treeLoss: 6.1,
      lastUpdated: '2024-04-03',
    },
    {
      id: '4',
      name: 'Jalpaiguri District',
      state: 'West Bengal',
      district: 'Jalpaiguri',
      latitude: 26.5,
      longitude: 88.7,
      riskLevel: 'High',
      riskScore: 7.0,
      rainfall: 189.2,
      discharge: 5600,
      treeLoss: 9.8,
      lastUpdated: '2024-04-03',
    },
    {
      id: '5',
      name: 'Ratnagiri District',
      state: 'Maharashtra',
      district: 'Ratnagiri',
      latitude: 16.8,
      longitude: 73.3,
      riskLevel: 'Moderate',
      riskScore: 5.9,
      rainfall: 142.5,
      discharge: 3900,
      treeLoss: 5.2,
      lastUpdated: '2024-04-03',
    },
    {
      id: '6',
      name: 'Lucknow District',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      latitude: 26.8,
      longitude: 80.9,
      riskLevel: 'Low',
      riskScore: 4.1,
      rainfall: 98.4,
      discharge: 2100,
      treeLoss: 3.1,
      lastUpdated: '2024-04-03',
    },
    {
      id: '7',
      name: 'Indore District',
      state: 'Madhya Pradesh',
      district: 'Indore',
      latitude: 22.7,
      longitude: 75.9,
      riskLevel: 'Low',
      riskScore: 3.8,
      rainfall: 112.6,
      discharge: 2800,
      treeLoss: 2.9,
      lastUpdated: '2024-04-03',
    },
    {
      id: '8',
      name: 'Mangalore District',
      state: 'Karnataka',
      district: 'Mangalore',
      latitude: 12.9,
      longitude: 74.9,
      riskLevel: 'Moderate',
      riskScore: 5.2,
      rainfall: 125.3,
      discharge: 3200,
      treeLoss: 4.5,
      lastUpdated: '2024-04-03',
    },
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical':
        return '#dc2626';
      case 'High':
        return '#ea580c';
      case 'Moderate':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    if (onMarkerClick) {
      onMarkerClick(location);
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-border shadow-sm">
        <MapContainer
          center={[23.1815, 79.9864]}
          zoom={5}
          style={{ height: '500px', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {floodLocations.map((location) => (
            <CustomMarker key={location.id} location={location} onMarkerClick={handleMarkerClick} />
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <Card className="p-4 border border-border shadow-sm bg-secondary">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-sm font-semibold text-foreground">Risk Level Legend</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-xs text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ea580c' }}></div>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#dc2626' }}></div>
            <span className="text-xs text-muted-foreground">Critical</span>
          </div>
        </div>
      </Card>

      {/* Selected Location Details */}
      {selectedLocation && (
        <Card className="p-6 border border-border shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{selectedLocation.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedLocation.state} • {selectedLocation.district}</p>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
              <p className="font-semibold text-foreground">{selectedLocation.riskLevel}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
              <p className="font-semibold text-foreground">{selectedLocation.riskScore.toFixed(1)}/10</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Rainfall (mm)</p>
              <p className="font-semibold text-foreground font-mono">{selectedLocation.rainfall.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Discharge (m³/s)</p>
              <p className="font-semibold text-foreground font-mono">{selectedLocation.discharge.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Tree Loss</p>
              <p className="font-semibold text-foreground">{selectedLocation.treeLoss.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Coordinates</p>
              <p className="font-semibold text-foreground text-xs font-mono">
                {selectedLocation.latitude.toFixed(2)}, {selectedLocation.longitude.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
              <p className="font-semibold text-foreground text-xs">{selectedLocation.lastUpdated}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Locations List */}
      <Card className="p-6 border border-border shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Monitored Locations</h3>
        <div className="space-y-2">
          {floodLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => setSelectedLocation(location)}
              className="w-full text-left p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{location.name}</p>
                  <p className="text-xs text-muted-foreground">{location.state} • {location.district}</p>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs font-semibold text-white"
                  style={{ backgroundColor: getRiskColor(location.riskLevel) }}
                >
                  {location.riskLevel}
                </span>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
