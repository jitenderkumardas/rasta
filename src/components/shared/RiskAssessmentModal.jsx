import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { evaluateHazardRisk } from '../../simulation/riskEngine';

const riskColors = {
  LOW: 'var(--color-status-low)',
  MEDIUM: 'var(--color-status-medium)',
  HIGH: 'var(--color-status-high)',
  SEVERE: 'var(--color-status-severe)'
};

const riskIcons = {
  LOW: '🛡️',
  MEDIUM: '⚠️',
  HIGH: '🚨',
  SEVERE: '🚫'
};

const nodeDetails = {
  hz126: { name: 'HZ-126: Tsiedukhru (Pagla Pahar)', type: 'Landslide / Rockfall', chainage: '126.0 km' },
  hz164: { name: 'HZ-164: Zubza', type: 'Subsidence / Landslide (15t Bridge Limit)', chainage: '164.0 km' },
  hz175: { name: 'HZ-175: Kohima Sinking Zone', type: 'Major Sinking Zone', chainage: '175.1–175.35 km' }
};

export default function RiskAssessmentModal() {
  const { selectedNode, setSelectedNode, rainfall } = useAppStore();
  const modalRef  = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeNode, setActiveNode] = useState(null);

  // Read close duration from CSS token (150ms default)
  const getCloseDur = () => {
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue('--modal-close-dur').trim();
    return parseFloat(val) || 150;
  };

  // Open: mount content, then add is-open on next frame
  useEffect(() => {
    if (selectedNode) {
      setActiveNode(selectedNode);
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          modalRef.current?.classList.add('is-open');
        });
      });
    }
  }, [selectedNode]);

  // Close handler: is-closing → wait → hide
  const handleClose = () => {
    const el = modalRef.current;
    if (!el) return;
    el.classList.remove('is-open');
    el.classList.add('is-closing');
    setTimeout(() => {
      el.classList.remove('is-closing');
      setIsVisible(false);
      setActiveNode(null);
      setSelectedNode(null);
    }, getCloseDur());
  };

  if (!isVisible || !activeNode) return null;

  const details = nodeDetails[activeNode];
  const rain    = rainfall[activeNode];
  const risk    = evaluateHazardRisk(rain.rain24h, rain.rain72h);
  const color   = riskColors[risk.level];

  return (
    /* Backdrop — fades with the modal */
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(11, 18, 32, 0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        animation: `modalFadeIn var(--duration-fast) var(--ease-smooth-out) both`
      }}
      onClick={handleClose}
    >
      {/* Modal card — state-driven t-modal */}
      <div
        ref={modalRef}
        className="t-modal"
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          padding: '1.5rem',
          width: '360px',
          boxShadow: 'var(--shadow-card)',
          border: `1px solid ${color}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)' }}>{details.name}</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              {details.type} • Chainage: {details.chainage}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="t-btn-hover"
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
          >✕</button>
        </div>

        {/* Risk Gauge Visualization */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-bg)', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem' }}>{riskIcons[risk.level]}</div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Risk Level</div>
            <div className="t-text-swap" style={{ fontSize: '1.5rem', fontWeight: 'bold', color }}>{risk.level}</div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.75rem', background: 'var(--color-bg)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Rainfall (24h)</div>
            <div className="t-number-pop-in" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
              {rain.rain24h} <span style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>mm</span>
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--color-bg)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Rainfall (72h)</div>
            <div className="t-number-pop-in" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
              {rain.rain72h} <span style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>mm</span>
            </div>
          </div>
        </div>

        {/* ETA to Block */}
        <div style={{ padding: '0.75rem', background: risk.level === 'SEVERE' ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-bg)', borderRadius: '8px', border: `1px solid ${risk.level === 'SEVERE' ? 'var(--color-status-severe)' : 'transparent'}` }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Estimated Time to Block</div>
          <div className="t-text-swap" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: risk.level === 'SEVERE' ? 'var(--color-status-severe)' : 'var(--color-text)' }}>
            {risk.etaToBlock}
          </div>
        </div>
      </div>
    </div>
  );
}