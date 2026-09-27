import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useAppStore } from '../../store/useAppStore';
import { getFleetState } from '../../simulation/fleetSimulator';
import L from 'leaflet';

// Real coordinates for the corridor nodes
const NODE_COORDS = {
  dimapur:        [25.9031, 93.7273],
  hz126:          [25.7400, 93.7900],
  hz164:          [25.7200, 94.0400],
  hz175:          [25.6747, 94.1110],
  imphal:         [24.8170, 93.9368],
  badarpur_nh37:  [24.9015, 92.6025],
  jiribam_nh37:   [24.7979, 93.1180]
};

// Route paths (arrays of coordinates)
const ROUTES = {
  nh29: [
    NODE_COORDS.dimapur,
    NODE_COORDS.hz126,
    NODE_COORDS.hz164,
    NODE_COORDS.hz175,
    NODE_COORDS.imphal
  ],
  nh37: [
    NODE_COORDS.dimapur,
    NODE_COORDS.badarpur_nh37,
    NODE_COORDS.jiribam_nh37,
    NODE_COORDS.imphal
  ]
};

const riskColors = {
  LOW: '#22C55E',
  MEDIUM: '#EAB308',
  HIGH: '#F97316',
  SEVERE: '#EF4444'
};

// Custom Truck Icon for Leaflet
const createTruckIcon = (isSpeedDropped) => {
  const color = isSpeedDropped ? '#EF4444' : '#2DD4BF';
  return L.divIcon({
    className: 'custom-truck-icon',
    html: `
      <div style="
        background-color: ${color}; 
        width: 32px; height: 32px; 
        border-radius: 50%; 
        border: 3px solid #0B1220; 
        box-shadow: 0 0 10px ${color};
        display: flex; align-items: center; justify-content: center;
        font-size: 16px;
        transition: all 0.3s ease;
      ">🚚</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

function MapController({ activeRoute }) {
  const map = useMap();
  
  // Keep the map focused on the corridor
  const bounds = [
    [24.70, 92.50], // South-West (Badarpur area)
    [26.00, 94.20]  // North-East (Dimapur area)
  ];

  return null; // Just used to set bounds if needed, but we set it on MapContainer
}

export default function CorridorMap() {
  const {
    riskLevels, activeRoute, routeDetails, stormActive,
    fleetStep, fleetRunning, setSelectedNode
  } = useAppStore();

  const fleetState = getFleetState(routeDetails?.path, fleetStep, stormActive);
  const truckCoords = fleetState.currentNode ? NODE_COORDS[fleetState.currentNode] : null;

  // Determine line styles
  const isNh29Active = activeRoute === 'NH-29';
  const isNh37Active = activeRoute === 'NH-37';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={[25.35, 93.5]} // Centered between Dimapur and Imphal
        zoom={8}               // Zoomed in to focus on the corridor
        minZoom={7}
        maxZoom={12}
        zoomControl={false}    // We'll add custom zoom control if needed, or let default style it
        style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-lg)' }}
        bounds={[[24.70, 92.50], [26.00, 94.20]]}
        boundsOptions={{ padding: [20, 20] }}
      >
        {/* OpenTopoMap Tiles - Light Terrain View */}
        <TileLayer
          attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          maxZoom={17}
        />

        {/* NH-37 Alternate Route */}
        <Polyline
          positions={ROUTES.nh37}
          pathOptions={{
            color: isNh37Active ? '#2DD4BF' : '#475569',
            weight: isNh37Active ? 5 : 3,
            opacity: isNh37Active ? 1 : 0.4,
            dashArray: isNh37Active ? null : '10, 10'
          }}
        />

        {/* NH-29 Primary Route */}
        <Polyline
          positions={ROUTES.nh29}
          pathOptions={{
            color: isNh29Active ? riskColors[riskLevels.hz175] : '#475569', // Simplified color for the whole line
            weight: isNh29Active ? 5 : 3,
            opacity: isNh29Active ? 1 : 0.4,
            dashArray: isNh29Active ? null : '10, 10'
          }}
        />

        {/* Hazard Nodes */}
        {['hz126', 'hz164', 'hz175'].map(nodeId => {
          const coords = NODE_COORDS[nodeId];
          const risk = riskLevels[nodeId];
          const color = riskColors[risk];
          
          return (
            <CircleMarker
              key={nodeId}
              center={coords}
              radius={10}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.8,
                weight: 2
              }}
              eventHandlers={{
                click: () => setSelectedNode(nodeId)
              }}
            >
              <Popup>
                <div style={{ color: '#0B1220', fontFamily: 'Inter, sans-serif' }}>
                  <strong>{nodeId.toUpperCase()}</strong><br/>
                  Risk Level: <span style={{ color: color, fontWeight: 'bold' }}>{risk}</span>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* City Labels (Dimapur & Imphal) - Changed to dark color for visibility on light map */}
        <CircleMarker center={NODE_COORDS.dimapur} radius={4} pathOptions={{ color: '#0e1012', fillColor: '#0e1012', fillOpacity: 1 }} />
        <CircleMarker center={NODE_COORDS.imphal} radius={4} pathOptions={{ color: '#0e1012', fillColor: '#0e1012', fillOpacity: 1 }} />

        {/* Animated Truck Marker */}
        {fleetRunning && truckCoords && (
          <CircleMarker
            center={truckCoords}
            radius={0} // Hide the actual circle, we use the DivIcon
            pathOptions={{ opacity: 0 }}
            icon={createTruckIcon(fleetState.isSpeedDropped)}
          >
            {fleetState.isSpeedDropped && (
              <Popup>
                <div style={{ color: '#EF4444', fontWeight: 'bold' }}>
                  ⚠️ SPEED DROP DETECTED<br/>
                  Speed: {fleetState.speed} km/h
                </div>
              </Popup>
            )}
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}