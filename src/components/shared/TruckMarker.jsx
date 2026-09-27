const NODE_POSITIONS = {
  dimapur: { x: 100, y: 100 },
  hz126: { x: 250, y: 100 },
  hz164: { x: 450, y: 150 },
  hz175: { x: 600, y: 120 },
  imphal: { x: 750, y: 100 },
  badarpur_nh37: { x: 250, y: 310 },
  jiribam_nh37: { x: 500, y: 325 }
};

export default function TruckMarker({ nodeId, speed, isSpeedDropped }) {
  const pos = NODE_POSITIONS[nodeId];
  if (!pos) return null;

  const badgeColor = isSpeedDropped ? 'var(--color-status-severe)' : 'var(--color-accent)';
  const badgeStroke = isSpeedDropped ? 'var(--color-status-severe)' : 'var(--color-text-dim)';

  return (
    <g className="t-icon-swap">
      {/* Speed-drop warning banner */}
      {isSpeedDropped && (
        <g>
          <rect
            x={pos.x - 80}
            y={pos.y - 75}
            width="160"
            height="22"
            rx="4"
            fill="rgba(239, 68, 68, 0.15)"
            stroke="var(--color-status-severe)"
            strokeWidth="1"
          />
          <text
            x={pos.x}
            y={pos.y - 60}
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-status-severe)"
            fontWeight="bold"
          >
            ⚠️ SPEED DROP DETECTED
          </text>
        </g>
      )}

      {/* Speed readout badge */}
      <rect
        x={pos.x - 30}
        y={pos.y - 52}
        width="60"
        height="22"
        rx="4"
        fill="var(--color-surface)"
        stroke={badgeStroke}
        strokeWidth="1"
      />
      <text
        x={pos.x}
        y={pos.y - 37}
        textAnchor="middle"
        fontSize="11"
        fill={badgeColor}
        fontWeight="bold"
      >
        {speed} km/h
      </text>

      {/* Truck icon */}
      <circle
        cx={pos.x}
        cy={pos.y - 20}
        r="12"
        fill={badgeColor}
        stroke="var(--color-bg)"
        strokeWidth="2"
      />
      <text
        x={pos.x}
        y={pos.y - 16}
        textAnchor="middle"
        fontSize="14"
      >
        🚚
      </text>
    </g>
  );
}