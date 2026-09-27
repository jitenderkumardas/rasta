import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

const STATUS_CHIPS = [
  { id: 'OPEN', label: 'Open', icon: '🛡️', color: 'var(--color-status-low)' },
  { id: 'RESTRICTED', label: 'Restricted', icon: '⚠️', color: 'var(--color-status-medium)' },
  { id: 'BLOCKED', label: 'Blocked', icon: '🚫', color: 'var(--color-status-severe)' }
];

export default function FieldofficerView() {
  const { fieldReport, submitFieldReport, formResetSignal } = useAppStore();

  // Local form state (not in store — this is UI state, not simulation state)
  const [selectedChip, setSelectedChip] = useState('OPEN');
  const [notes, setNotes] = useState('');
  const [photoAttached, setPhotoAttached] = useState(false);

  const chipsBarRef = useRef(null);
  const chipPillRef = useRef(null);

  // Watch formResetSignal to clear form on reset
  useEffect(() => {
    setSelectedChip('OPEN');
    setNotes('');
    setPhotoAttached(false);
  }, [formResetSignal]);

  // Sliding pill — update position whenever selectedChip changes
  useEffect(() => {
    const bar = chipsBarRef.current;
    const pill = chipPillRef.current;
    if (!bar || !pill) return;
    const activeBtn = bar.querySelector('[aria-selected="true"]');
    if (!activeBtn) return;
    const movePill = (animate) => {
      if (!animate) {
        const prev = pill.style.transition;
        pill.style.transition = 'none';
        pill.style.transform = `translateX(${activeBtn.offsetLeft - 4}px)`;
        pill.style.width = `${activeBtn.offsetWidth}px`;
        void pill.offsetWidth; // force reflow
        pill.style.transition = prev;
      } else {
        pill.style.transform = `translateX(${activeBtn.offsetLeft - 4}px)`;
        pill.style.width = `${activeBtn.offsetWidth}px`;
      }
    };
    movePill(true);
  }, [selectedChip]);

  const handleSubmit = () => {
    submitFieldReport({
      photo: photoAttached ? 'placeholder.jpg' : null,
      status: selectedChip,
      notes
    });
  };

  const isSubmitting = fieldReport.status === 'saving';
  const isSynced = fieldReport.status === 'synced';
  const canSubmit = !isSubmitting && !isSynced;

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
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {/* Signal icon swaps based on sync status */}
            <span className="t-icon-swap">
              {isSynced ? '📶' : '📵'}
            </span>
            <span>📡 🔋</span>
          </span>
        </div>

        {/* Sync Status Banner */}
        {fieldReport.status !== 'idle' && (
          <div
            key={fieldReport.status} // Re-trigger animation on status change
            className="t-panel-reveal"
            style={{
              margin: '0.75rem 1rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: isSynced ? 'rgba(45, 212, 191, 0.15)' : 'rgba(139, 151, 172, 0.1)',
              border: `1px solid ${isSynced ? 'var(--color-accent)' : 'var(--color-text-muted)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span className="t-icon-swap" style={{ fontSize: '1.2rem' }}>
              {isSynced ? '✓' : '☁️🚫'}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: isSynced ? 'var(--color-accent)' : 'var(--color-text-muted)'
              }}>
                {isSynced ? 'Synced ✓' : 'Saving locally — no signal'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                {isSynced ? 'Report uploaded to server' : 'Will sync when connection returns'}
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem 0.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Field Report
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
            Road Condition Report
          </div>
        </div>

        {/* Form Content */}
        <div style={{
          padding: '1rem 1.5rem',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Photo Placeholder */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Photo Evidence
            </div>
            <div
              onClick={() => !isSubmitting && setPhotoAttached(!photoAttached)}
              style={{
                width: '100%',
                aspectRatio: '1',
                maxHeight: '180px',
                borderRadius: '12px',
                border: `2px dashed ${photoAttached ? 'var(--color-accent)' : 'var(--color-text-muted)'}`,
                background: photoAttached ? 'rgba(45, 212, 191, 0.05)' : 'var(--color-bg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'border-color var(--duration-fast) var(--ease-smooth-out), background var(--duration-fast) var(--ease-smooth-out)'
              }}
            >
              <span style={{ fontSize: '2.5rem', opacity: photoAttached ? 1 : 0.5 }}>
                {photoAttached ? '📷' : '📸'}
              </span>
              <div style={{
                fontSize: '0.8rem',
                color: photoAttached ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontWeight: photoAttached ? 'bold' : 'normal'
              }}>
                {photoAttached ? '✓ Photo attached' : 'Tap to attach photo'}
              </div>
            </div>
          </div>

          {/* Status Chips */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Road Status
            </div>
            <div className="t-status-chips" ref={chipsBarRef}>
              <span className="t-status-chip-pill" ref={chipPillRef}
                style={{
                  borderColor: STATUS_CHIPS.find(c => c.id === selectedChip)?.color + '55' || 'transparent',
                  background: (STATUS_CHIPS.find(c => c.id === selectedChip)?.color || 'transparent') + '15'
                }}
              />
              {STATUS_CHIPS.map(chip => {
                const isSelected = selectedChip === chip.id;
                return (
                  <button
                    key={chip.id}
                    role="tab"
                    aria-selected={isSelected ? 'true' : 'false'}
                    onClick={() => !isSubmitting && setSelectedChip(chip.id)}
                    disabled={isSubmitting}
                    className="t-status-chip"
                    style={{
                      color: isSelected ? chip.color : 'var(--color-text-muted)',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{chip.icon}</span>
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Notes
            </div>
            <textarea
              value={notes}
              onChange={(e) => !isSubmitting && setNotes(e.target.value)}
              disabled={isSubmitting}
              placeholder="Describe the road condition..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                cursor: isSubmitting ? 'not-allowed' : 'text'
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`t-btn-hover${isSynced ? ' t-success-check' : ''}`}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              background: isSynced
                ? 'var(--color-status-low)'
                : isSubmitting
                  ? 'var(--color-text-muted)'
                  : 'var(--color-accent)',
              color: 'var(--color-bg)',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'background var(--duration-quick) var(--ease-in-out)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {isSynced ? (
              <>✓ Report Synced</>
            ) : isSubmitting ? (
              <>⏳ Saving...</>
            ) : (
              <>📤 Submit Report</>
            )}
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