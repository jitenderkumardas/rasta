/**
 * Community View — SMS/IVR Mock
 *
 * Per design.md: "a basic-phone-style mock (not a modern smartphone UI)
 * showing one received message bubble, in English with the regional-language
 * version shown alongside or on toggle."
 *
 * This screen is deliberately STATIC — no interaction, no state changes.
 * It exists purely to complete the narrative arc: the alert that started
 * on the DDMA dashboard has now reached the last-mile recipient on a
 * basic phone via SMS/IVR, in their language.
 *
 * Per rules.md Section 2: "The one multilingual alert example should be
 * a single, fixed, pre-written string pair — do not attempt to call any
 * translation API."
 *
 * Language choice: Hindi (Devanagari) — widely understood across the NE
 * corridor and reliably renderable on any basic phone. In production,
 * this would be delivered via Bhashini in the recipient's preferred
 * language (Meitei, Ao, Tangkhul, etc.) — see prd.md Section 6.
 */

const ALERT_EN =
  '⚠️ ALERT: Heavy landslide risk on NH-29 near Kohima. Avoid travel until further notice. — DDMA Nagaland';

const ALERT_HI =
  '⚠️ सूचना: कोहिमा के पास NH-29 पर भारी भूस्खलन का खतरा। अगली सूचना तक यात्रा न करें। — डिडमा नागालैंड';

export default function CommunityView() {
  return (
    <div
      className="t-page-side-by-side"
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.5rem'
        }}>
          Last-Mile Delivery · SMS/IVR Mock
        </div>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'var(--color-text)',
          marginBottom: '0.75rem'
        }}>
          Community Alert Received
        </div>
        <div style={{
          fontSize: '0.9rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5
        }}>
          The same Track A alert that reached the Warehouse is also delivered
          via SMS/IVR to merchants, PHCs, and residents along the corridor —
          in their preferred language.
        </div>
      </div>

      {/* Basic Phone Mock */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {/* Phone body */}
        <div style={{
          width: '280px',
          background: '#1a1f2e',
          borderRadius: '24px 24px 40px 40px',
          padding: '16px 14px 20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {/* Antenna hint */}
          <div style={{
            width: '4px',
            height: '14px',
            background: '#2a2f3e',
            borderRadius: '2px',
            margin: '0 auto 8px'
          }} />

          {/* Speaker grille */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3px',
            marginBottom: '10px'
          }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: '#0a0f1a'
              }} />
            ))}
          </div>

          {/* LCD Screen */}
          <div style={{
            background: '#0a1a14',
            borderRadius: '6px',
            padding: '10px',
            minHeight: '240px',
            border: '2px solid #050a08',
            boxShadow: 'inset 0 0 8px rgba(45, 212, 191, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontFamily: 'monospace'
          }}>
            {/* Status bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '9px',
              color: '#4ade80',
              letterSpacing: '0.05em'
            }}>
              <span>📶 Airtel</span>
              <span>🔋 82%</span>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: 'rgba(74, 222, 128, 0.2)'
            }} />

            {/* Message header */}
            <div style={{
              fontSize: '10px',
              color: '#4ade80',
              fontWeight: 'bold'
            }}>
              📨 SMS · DDMA-NAG
            </div>
            <div style={{
              fontSize: '8px',
              color: 'rgba(74, 222, 128, 0.6)'
            }}>
              Today, 09:41
            </div>

            {/* English message bubble */}
            <div style={{
              background: 'rgba(74, 222, 128, 0.1)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '10px',
              color: '#4ade80',
              lineHeight: 1.4
            }}>
              {ALERT_EN}
            </div>

            {/* Hindi message bubble */}
            <div style={{
              background: 'rgba(45, 212, 191, 0.1)',
              border: '1px solid rgba(45, 212, 191, 0.3)',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '11px',
              color: '#2DD4BF',
              lineHeight: 1.5
            }}>
              {ALERT_HI}
            </div>

            {/* Footer prompt */}
            <div style={{
              fontSize: '8px',
              color: 'rgba(74, 222, 128, 0.5)',
              textAlign: 'center',
              marginTop: 'auto'
            }}>
              [OK] Read  [✎] Reply
            </div>
          </div>

          {/* Soft keys */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            padding: '0 8px'
          }}>
            <div style={{
              width: '40px',
              height: '14px',
              background: '#0a0f1a',
              borderRadius: '3px'
            }} />
            <div style={{
              width: '40px',
              height: '14px',
              background: '#0a0f1a',
              borderRadius: '3px'
            }} />
          </div>

          {/* D-pad */}
          <div style={{
            width: '70px',
            height: '70px',
            margin: '10px auto',
            borderRadius: '50%',
            background: '#0a0f1a',
            border: '2px solid #2a2f3e',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#1a1f2e',
              border: '1px solid #2a2f3e'
            }} />
          </div>

          {/* Numeric keypad */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            padding: '0 12px'
          }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
              <div key={key} style={{
                height: '22px',
                background: '#0a0f1a',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#4a5568',
                fontFamily: 'monospace',
                border: '1px solid #1a1f2e'
              }}>
                {key}
              </div>
            ))}
          </div>
        </div>

        {/* Phone label */}
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
          marginTop: '0.5rem'
        }}>
          Feature phone · SMS delivery · No smartphone required
        </div>
      </div>

      {/* Explanation Card */}
      <div
        className="t-panel-reveal"
        style={{
          maxWidth: '600px',
          width: '100%',
          padding: '1.25rem',
          borderRadius: 'var(--radius-card)',
          background: 'var(--color-surface)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid rgba(45, 212, 191, 0.2)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'start',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '1.5rem' }}>ℹ️</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '0.95rem',
              fontWeight: 'bold',
              color: 'var(--color-text)',
              marginBottom: '0.5rem'
            }}>
              How this works in production
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.6
            }}>
              When the Track A alert fires on the DDMA dashboard, the same alert
              payload is pushed to an SMS/IVR gateway. Recipients registered along
              the corridor receive the message in their preferred language via
              <strong style={{ color: 'var(--color-accent)' }}> Bhashini translation integration</strong>.
              This mock shows a single fixed English + Hindi pair — in production,
              the language would be selected per-recipient (Meitei, Ao, Tangkhul,
              Hindi, etc.) and delivered via SMS to basic phones or IVR voice call
              for non-literate recipients.
            </div>
            <div style={{
              marginTop: '0.75rem',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
              padding: '0.5rem 0.75rem',
              background: 'var(--color-bg)',
              borderRadius: '6px',
              borderLeft: '2px solid var(--color-accent)'
            }}>
              Demo note: No real SMS is sent. No translation API is called. This
              is a static render to complete the narrative.
            </div>
          </div>
        </div>
      </div>

      {/* Narrative completion marker */}
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        maxWidth: '500px',
        lineHeight: 1.5,
        padding: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        marginTop: '1rem'
      }}>
        🎯 <strong style={{ color: 'var(--color-accent)' }}>Narrative complete.</strong>
        {' '}The same storm that triggered the DDMA dashboard alert has now reached
        the last mile — a merchant in Kohima on a basic phone, in their language.
        Return to <strong>/dashboard</strong> and click <strong>Reset Demo</strong> to re-run.
      </div>
    </div>
  );
}