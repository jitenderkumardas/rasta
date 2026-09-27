import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getFleetState } from '../simulation/fleetSimulator';

const riskColors = {
  LOW: 'var(--color-status-low)',
  MEDIUM: 'var(--color-status-medium)',
  HIGH: 'var(--color-status-high)',
  SEVERE: 'var(--color-status-severe)'
};

export default function DriverView() {
  const {
    activeRoute, routeDetails, alerts, stormActive,
    riskLevels, fleetStep, fleetRunning
  } = useAppStore();
  
  const [acknowledged, setAcknowledged] = useState(false);
  
  // Alert banner only shows when Track B is published (governed flow)
  const showBanner = alerts.trackB?.status === 'published';
  const recommendedRoute = activeRoute;
  
  // Fleet state for truck marker
  const fleetState = getFleetState(routeDetails?.path, fleetStep, stormActive);
  
  // Route details for comparison cards
  const nh29Time = 5.5;
  const nh37Time = 8.5;
  const nh29Hazards = 3;
  const nh37Hazards = 0;
  
  // During storm, NH-29 is BLOCKED
  const nh29Status = stormActive ? 'BLOCKED' : 'OPEN';
  const nh37Status = 'OPEN';
  
  const handleAcknowledge = () => {
    setAcknowledged(true);
    setTimeout(() => setAcknowledged(false), 3000);
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--color-bg)'
    }}>
      {/* Phone Frame */}
      <div className="mobile-frame">
        {/* Status Bar */}
        <div style={{
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <span>9:41</span>
          <span>📶 📡 🔋</span>
        </div>
        
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem 0.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            RASTA Driver
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
            Active Route
          </div>
        </div>
        
        {/* Alert Banner - only visible when Track B is published */}
        {showBanner && (
          <div className="t-panel-reveal" style={{
            margin: '0.75rem 1rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: 'rgba(45, 212, 191, 0.1)',
            border: '1px solid var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🚨</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>
                AUTHORIZED REROUTE
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>
                Switch to {recommendedRoute} for safer transit
              </div>
            </div>
          </div>
        )}
        
        {/* Mini Map */}
        <div style={{ padding: '0.75rem 1rem' }}>
          <MiniMap 
            activeRoute={recommendedRoute} 
            riskLevels={riskLevels} 
            fleetState={fleetState} 
            fleetRunning={fleetRunning}
            routePath={routeDetails?.path}
          />
        </div>
        
        {/* Route Comparison Cards */}
        <div style={{
          padding: '0.75rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          flex: 1,
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Route Options
          </div>
          
          <RouteCard
            routeId="NH-29"
            title="NH-29 · Dimapur → Imphal"
            subtitle="Via Kohima"
            time={nh29Time}
            hazards={nh29Hazards}
            status={nh29Status}
            isRecommended={recommendedRoute === 'NH-29'}
            isAlternate={recommendedRoute === 'NH-37'}
          />
          
          <RouteCard
            routeId="NH-37"
            title="NH-37 · Dimapur → Imphal"
            subtitle="Via Jiribam"
            time={nh37Time}
            hazards={nh37Hazards}
            status={nh37Status}
            isRecommended={recommendedRoute === 'NH-37'}
            isAlternate={recommendedRoute === 'NH-29'}
          />
        </div>
        
        {/* Primary Action Button */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={handleAcknowledge}
            className="t-btn-hover t-success-check"
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              background: acknowledged ? 'var(--color-status-low)' : 'var(--color-accent)',
              color: 'var(--color-bg)',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background var(--duration-quick) var(--ease-in-out)'
            }}
          >
            {acknowledged ? '✓ Acknowledged' : `Reroute to ${recommendedRoute}`}
          </button>
        </div>
        
        {/* Home Indicator */}
        <div style={{
          padding: '0.5rem',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '4px',
            background: 'var(--color-text-muted)',
            borderRadius: '2px',
            opacity: 0.3
          }} />
        </div>
      </div>
    </div>
  );
}

function MiniMap({ activeRoute, riskLevels, fleetState, fleetRunning, routePath }) {
  const getNodePosition = (nodeId) => {
    const positions = {
      dimapur: { x: 30, y: 40 },
      hz126: { x: 120, y: 40 },
      hz164: { x: 200, y: 70 },
      hz175: { x: 260, y: 50 },
      imphal: { x: 320, y: 40 },
      badarpur_nh37: { x: 120, y: 145 },
      jiribam_nh37: { x: 220, y: 150 }
    };
    return positions[nodeId] || { x: 30, y: 40 };
  };
  
  const truckPos = fleetState.currentNode ? getNodePosition(fleetState.currentNode) : null;
  
  return (
    <svg viewBox="0 0 350 180" style={{ width: '100%', height: '180px', background: 'var(--color-bg)', borderRadius: '12px' }}>
      {/* NH-37 Alternate */}
      <path
        d="M 30 140 Q 175 160 320 140"
        fill="none"
        stroke={activeRoute === 'NH-37' ? 'var(--color-accent)' : 'var(--color-text-muted)'}
        strokeWidth={activeRoute === 'NH-37' ? 4 : 2}
        strokeDasharray={activeRoute === 'NH-37' ? 'none' : '4,3'}
        opacity={activeRoute === 'NH-37' ? 1 : 0.4}
      />
      
      {/* NH-29 Primary */}
      <line x1="30" y1="40" x2="120" y2="40" stroke={activeRoute === 'NH-29' ? riskColors[riskLevels.hz126] : 'var(--color-text-muted)'} strokeWidth={activeRoute === 'NH-29' ? 4 : 2} opacity={activeRoute === 'NH-29' ? 1 : 0.4} />
      <line x1="120" y1="40" x2="200" y2="70" stroke={activeRoute === 'NH-29' ? riskColors[riskLevels.hz164] : 'var(--color-text-muted)'} strokeWidth={activeRoute === 'NH-29' ? 4 : 2} opacity={activeRoute === 'NH-29' ? 1 : 0.4} />
      <line x1="200" y1="70" x2="260" y2="50" stroke={activeRoute === 'NH-29' ? riskColors[riskLevels.hz175] : 'var(--color-text-muted)'} strokeWidth={activeRoute === 'NH-29' ? 4 : 2} opacity={activeRoute === 'NH-29' ? 1 : 0.4} />
      <line x1="260" y1="50" x2="320" y2="40" stroke={activeRoute === 'NH-29' ? riskColors[riskLevels.hz175] : 'var(--color-text-muted)'} strokeWidth={activeRoute === 'NH-29' ? 4 : 2} opacity={activeRoute === 'NH-29' ? 1 : 0.4} />
      
      {/* Nodes */}
      <circle cx="30" cy="40" r="4" fill="var(--color-text)" />
      <text x="30" y="30" textAnchor="middle" fill="var(--color-text)" fontSize="8">Dimapur</text>
      
      <circle cx="120" cy="40" r="6" fill={riskColors[riskLevels.hz126]} />
      <text x="120" y="25" textAnchor="middle" fill="var(--color-text)" fontSize="8">HZ-126</text>
      
      <circle cx="200" cy="70" r="6" fill={riskColors[riskLevels.hz164]} />
      <text x="200" y="90" textAnchor="middle" fill="var(--color-text)" fontSize="8">HZ-164</text>
      
      <circle cx="260" cy="50" r="6" fill={riskColors[riskLevels.hz175]} />
      <text x="260" y="40" textAnchor="middle" fill="var(--color-text)" fontSize="8">HZ-175</text>
      
      <circle cx="320" cy="40" r="4" fill="var(--color-text)" />
      <text x="320" y="30" textAnchor="middle" fill="var(--color-text)" fontSize="8">Imphal</text>
      
      {/* Truck marker */}
      {fleetRunning && truckPos && (
        <g className="t-icon-swap">
          <circle cx={truckPos.x} cy={truckPos.y} r="8" fill={fleetState.isSpeedDropped ? 'var(--color-status-severe)' : 'var(--color-accent)'} stroke="var(--color-bg)" strokeWidth="2" />
          <text x={truckPos.x} y={truckPos.y + 3} textAnchor="middle" fontSize="10">🚚</text>
        </g>
      )}
    </svg>
  );
}

function RouteCard({ routeId, title, subtitle, time, hazards, status, isRecommended, isAlternate }) {
  const statusColors = {
    OPEN: 'var(--color-status-low)',
    RESTRICTED: 'var(--color-status-medium)',
    BLOCKED: 'var(--color-status-severe)'
  };
  
  const statusIcons = {
    OPEN: '🛡️',
    RESTRICTED: '⚠️',
    BLOCKED: '🚫'
  };
  
  return (
    <div
      className="t-card-resize"
      style={{
        padding: isRecommended ? '1rem' : '0.75rem',
        borderRadius: '12px',
        border: `2px solid ${isRecommended ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
        background: isRecommended ? 'rgba(45, 212, 191, 0.05)' : 'var(--color-bg)',
        opacity: isAlternate ? 0.5 : 1,
        position: 'relative',
        /* Enumerate exact properties — no transition:all */
        transition: [
          'border-color var(--duration-fast) var(--ease-smooth-out)',
          'background var(--duration-fast) var(--ease-smooth-out)',
          'padding var(--duration-fast) var(--ease-smooth-out)',
          'opacity var(--duration-fast) var(--ease-smooth-out)'
        ].join(', ')
      }}
    >
      {isRecommended && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '12px',
          padding: '2px 8px',
          borderRadius: '4px',
          background: 'var(--color-accent)',
          color: 'var(--color-bg)',
          fontSize: '0.65rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          ✓ Recommended
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
            {title}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {subtitle}
          </div>
        </div>
        <div style={{
          padding: '2px 8px',
          borderRadius: '4px',
          background: `${statusColors[status]}20`,
          color: statusColors[status],
          fontSize: '0.7rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          {statusIcons[status]} {status}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>Time</div>
          <div style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>{time}h</div>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>Hazards</div>
          <div style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>{hazards}</div>
        </div>
      </div>
    </div>
  );
}