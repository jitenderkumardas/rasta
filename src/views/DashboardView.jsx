import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useFleetAnimation } from '../hooks/useFleetAnimation';
import CorridorMap from '../components/map/CorridorMap';
import RiskAssessmentModal from '../components/shared/RiskAssessmentModal';

export default function DashboardView() {
  const {
    stormActive, truckWeight, activeRoute, routeDetails,
    fleetRunning, startFleet, stopFleet,
    setTruckWeight, triggerStorm, resetDemo, authorizeAlert, alerts
  } = useAppStore();

  useFleetAnimation();

  useEffect(() => {
    startFleet();
    return () => stopFleet();
  }, [startFleet, stopFleet]);

  return (
    <div className="dashboard-layout">

      {/* ========================================== */}
      {/* LEFT: MAIN CONTENT AREA (Takes remaining width) */}
      {/* ========================================== */}
      <main className="dashboard-main">

        {/* Top Scorecards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-md)'
        }}>
          <ScoreCard icon="🛡️" label="Open Segments" value="1" color="var(--color-status-low)" />
          <ScoreCard icon="⚠️" label="Restricted" value="0" color="var(--color-status-medium)" />
          <ScoreCard icon="🚫" label="Blocked" value="0" color="var(--color-status-severe)" />
        </div>

        {/* Map Container (Expands to fill available vertical space) */}
        <div style={{
          flex: 1,
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          minHeight: '300px'
        }}>
          <CorridorMap />
        </div>

        {/* Route Details Panel */}
        {routeDetails && !routeDetails.isHoldingPlaza && (
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: 'var(--space-md) var(--space-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 'var(--space-xs)'
              }}>
                Computed Route
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: activeRoute === 'NH-29' ? 'var(--color-text)' : 'var(--color-accent)'
              }}>
                {activeRoute} {activeRoute === 'NH-37' && <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>(Rerouted)</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 'var(--space-xs)'
              }}>
                Total Travel Time
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {routeDetails.totalTime.toFixed(1)}h
              </div>
            </div>
            {routeDetails.excludedEdges.length > 0 && (
              <div style={{
                marginLeft: 'var(--space-lg)',
                padding: 'var(--space-sm) var(--space-md)',
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                color: 'var(--color-status-high)',
                fontWeight: '500'
              }}>
                ⚠️ {routeDetails.excludedEdges.length} edge(s) excluded by bridge filter ({truckWeight}t)
              </div>
            )}
          </div>
        )}

        {/* Demo Controls */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: 'var(--space-md) var(--space-lg)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--space-md)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: '600',
            marginRight: 'var(--space-sm)'
          }}>
            Demo Controls:
          </span>

          <DemoButton
            onClick={() => { resetDemo(); setTimeout(startFleet, 50); }}
            variant="secondary"
            icon="🔄"
            label="Reset Demo"
          />
          <DemoButton
            onClick={() => { resetDemo(); setTimeout(startFleet, 50); }}
            variant="success"
            icon="☀️"
            label="Clear Weather — 12t"
          />
          <DemoButton
            onClick={triggerStorm}
            variant="danger"
            icon="⛈️"
            label="Trigger Storm"
          />
          <DemoButton
            onClick={() => setTruckWeight(25)}
            variant="warning"
            icon="🚛"
            label="25t Truck"
          />

          <div style={{ marginLeft: 'auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-md)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: fleetRunning ? 'var(--color-status-low)' : 'var(--color-text-dim)',
              boxShadow: fleetRunning ? '0 0 8px var(--color-status-low)' : 'none'
            }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Fleet: {fleetRunning ? 'Running' : 'Paused'}
            </span>
            <button
              onClick={fleetRunning ? stopFleet : startFleet}
              style={{
                padding: 'var(--space-xs) var(--space-md)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color-light)',
                background: 'transparent',
                color: 'var(--color-text)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-surface-light)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {fleetRunning ? 'Pause' : 'Start'}
            </button>
          </div>
          </div>
        </div>
      </main>

      {/* ========================================== */}
      {/* RIGHT: ALERT QUEUE PANEL (Fixed width)     */}
      {/* ========================================== */}
      <aside className="dashboard-aside" style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: 'var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: '600',
          paddingBottom: 'var(--space-md)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)'
        }}>
          <span>🔔</span>
          Alert Queue
        </div>

        {alerts.trackA && (
          <AlertCard
            type="trackA"
            icon="🚨"
            title="Track A · Auto"
            message={alerts.trackA.message}
            subtitle="Visible to Warehouse · No approval required"
          />
        )}

        {alerts.trackB && (
          <AlertCard
            type="trackB"
            icon={alerts.trackB.status === 'published' ? '✅' : '⏳'}
            title="Track B · Governed"
            message={alerts.trackB.message}
            status={alerts.trackB.status}
            onAuthorize={authorizeAlert}
          />
        )}

        {!alerts.trackA && !alerts.trackB && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-md)',
            opacity: 0.5,
            padding: 'var(--space-2xl)'
          }}>
            <div style={{ fontSize: '2.5rem' }}>🔕</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              No active alerts
            </div>
          </div>
        )}
      </aside>

      <RiskAssessmentModal />
    </div>
  );
}

/* ========================================== */
/* Helper Components                          */
/* ========================================== */

function ScoreCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      padding: 'var(--space-md) var(--space-lg)',
      boxShadow: 'var(--shadow-sm)',
      textAlign: 'left'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-xs)',
        fontSize: '0.75rem',
        color: color,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        <span>{icon}</span>
        {label}
      </div>
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'var(--color-text)',
        lineHeight: 1
      }}>
        {value}
      </div>
    </div>
  );
}

function DemoButton({ onClick, variant, icon, label }) {
  const variants = {
    secondary: { border: '1px solid var(--border-color-light)', background: 'transparent', color: 'var(--color-text)' },
    success: { border: '1px solid var(--color-status-low)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-status-low)' },
    danger: { border: '1px solid var(--color-status-severe)', background: 'var(--color-status-severe)', color: 'white', fontWeight: '600' },
    warning: { border: '1px solid var(--color-status-medium)', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-status-medium)' }
  };
  const style = variants[variant];

  return (
    <button
      onClick={onClick}
      style={{
        padding: 'var(--space-sm) var(--space-md)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.8rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        transition: 'all 0.2s ease',
        ...style
      }}
      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

function AlertCard({ type, icon, title, message, subtitle, status, onAuthorize }) {
  const isTrackA = type === 'trackA';
  const isPublished = status === 'published';

  return (
    <div
      className="t-panel-reveal"
      style={{
        padding: 'var(--space-md)',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${isTrackA ? 'rgba(239, 68, 68, 0.3)' : isPublished ? 'var(--color-status-low)' : 'var(--color-status-high)'}`,
        background: isTrackA ? 'rgba(239, 68, 68, 0.05)' : isPublished ? 'rgba(16, 185, 129, 0.08)' : 'var(--color-surface-light)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-sm)',
        fontSize: '0.7rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: isTrackA ? 'var(--color-text-muted)' : isPublished ? 'var(--color-status-low)' : 'var(--color-status-high)'
      }}>
        <span>{icon}</span>
        {title}
        {!isTrackA && (
          <span style={{
            marginLeft: 'auto',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            background: isPublished ? 'var(--color-status-low)' : 'var(--color-status-high)',
            color: 'var(--color-bg)',
            fontSize: '0.6rem',
            fontWeight: 'bold'
          }}>
            {status?.toUpperCase()}
          </span>
        )}
      </div>

      <div style={{
        fontSize: '0.875rem',
        color: 'var(--color-text)',
        lineHeight: 1.5,
        marginBottom: subtitle || !isTrackA ? 'var(--space-md)' : 0
      }}>
        {message}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', fontStyle: 'italic' }}>
          {subtitle}
        </div>
      )}

      {!isTrackA && status === 'pending' && onAuthorize && (
        <button
          onClick={onAuthorize}
          className="t-success-check"
          style={{
            width: '100%',
            padding: 'var(--space-sm) var(--space-md)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'var(--color-accent)',
            color: 'var(--color-bg)',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            marginTop: 'var(--space-sm)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-accent-hover)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          ✓ Authorize Advisory
        </button>
      )}

      {!isTrackA && isPublished && (
        <div
          className="t-success-check"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--color-status-low)',
            fontWeight: '600',
            fontSize: '0.8rem',
            textAlign: 'center',
            marginTop: 'var(--space-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)'
          }}
        >
          ✓ Advisory Published — Driver Notified
        </div>
      )}
    </div>
  );
}