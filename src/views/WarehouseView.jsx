import { useAppStore } from '../store/useAppStore';

// Static warehouse data (per design.md: "static numbers are fine")
const COMMODITIES = [
  { id: 'grain', label: 'Food Grain', icon: '🌾', currentStock: 850, maxStock: 1000, unit: 'MT' },
  { id: 'medicine', label: 'Medicine', icon: '💊', currentStock: 320, maxStock: 500, unit: 'kits' },
  { id: 'fuel', label: 'Fuel', icon: '⛽', currentStock: 12000, maxStock: 20000, unit: 'L' }
];

export default function WarehouseView() {
  const { alerts, warehouseDispatchAcknowledged, acknowledgeWarehouseDispatch } = useAppStore();

  const showTrackA = alerts.trackA !== null;
  const isAcknowledged = warehouseDispatchAcknowledged;

  // Lead time calculation (static for demo — in production this would be dynamic)
  const leadTimeHours = 48;

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      background: 'var(--color-bg)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Civil Supply Warehouse
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
              FCI / NHM Buffer Stock Dashboard
            </div>
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background: 'var(--color-surface)',
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)'
          }}>
            📍 Dimapur Depot
          </div>
        </div>

        {/* Track A Alert Banner (Phase 8) */}
        {showTrackA && !isAcknowledged && (
          <div
            className="t-panel-reveal"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-card)',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '2px solid var(--color-status-severe)',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>🚨</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-status-severe)',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  Track A · Auto Alert · No Approval Required
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  color: 'var(--color-text)',
                  fontWeight: 'bold',
                  marginBottom: '0.75rem',
                  lineHeight: 1.4
                }}>
                  {alerts.trackA.message}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                      Lead Time
                    </div>
                    <div className="t-number-pop-in" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-status-severe)' }}>
                      {leadTimeHours}h
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                      Action Required
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 'bold' }}>
                      Dispatch buffer stock
                    </div>
                  </div>
                </div>
                <button
                  onClick={acknowledgeWarehouseDispatch}
                  className="t-btn-hover"
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--color-status-severe)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ✓ Acknowledge & Dispatch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dispatch Acknowledged State */}
        {showTrackA && isAcknowledged && (
          <div
            className="t-success-check"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-card)',
              background: 'rgba(34, 197, 94, 0.08)',
              border: '2px solid var(--color-status-low)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <div style={{ fontSize: '2rem' }}>✓</div>
            <div>
              <div style={{
                fontSize: '1.1rem',
                color: 'var(--color-status-low)',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>
                Dispatch Acknowledged
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Buffer stock dispatch initiated · ETA to affected zones: {leadTimeHours}h
              </div>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {COMMODITIES.map(commodity => {
            const percentage = (commodity.currentStock / commodity.maxStock) * 100;
            const statusColor = percentage > 60 ? 'var(--color-status-low)' : percentage > 30 ? 'var(--color-status-medium)' : 'var(--color-status-severe)';
            
            return (
              <div
                key={commodity.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-card)',
                  background: 'var(--color-surface)',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{commodity.icon}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{commodity.label}</div>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    background: `${statusColor}20`,
                    color: statusColor,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {percentage.toFixed(0)}%
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                  {commodity.currentStock.toLocaleString()} <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>{commodity.unit}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  of {commodity.maxStock.toLocaleString()} {commodity.unit} capacity
                </div>
              </div>
            );
          })}
        </div>

        {/* Vertical Stock-Level Bar-Fill Visualization */}
        <div style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-card)',
          background: 'var(--color-surface)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1.5rem'
          }}>
            Current Stock Levels
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'end',
            flexWrap: 'wrap',
            minHeight: '200px',
            gap: '2rem'
          }}>
            {COMMODITIES.map(commodity => {
              const percentage = (commodity.currentStock / commodity.maxStock) * 100;
              const statusColor = percentage > 60 ? 'var(--color-status-low)' : percentage > 30 ? 'var(--color-status-medium)' : 'var(--color-status-severe)';
              
              return (
                <div
                  key={commodity.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flex: 1
                  }}
                >
                  {/* Vertical bar */}
                  <div style={{
                    width: '60px',
                    height: '160px',
                    background: 'var(--color-bg)',
                    borderRadius: '8px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {/* Fill — t-card-resize handles height transition via token */}
                    <div
                      className="t-card-resize"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${percentage}%`,
                        background: `linear-gradient(to top, ${statusColor}, ${statusColor}80)`
                      }}
                    />
                    {/* Percentage label inside bar */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      color: 'var(--color-text)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                  {/* Label below bar */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{commodity.icon}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{commodity.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Footer */}
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          background: 'rgba(45, 212, 191, 0.05)',
          border: '1px solid rgba(45, 212, 191, 0.2)',
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5
        }}>
          <strong style={{ color: 'var(--color-accent)' }}>ℹ️ Track A Alert Flow:</strong> When risk on NH-29 reaches HIGH or SEVERE, this warehouse receives an auto-alert with no governance gate — enabling immediate buffer stock dispatch to affected zones while DDMA reviews the Track B reroute advisory for the active fleet.
        </div>
      </div>
    </div>
  );
}