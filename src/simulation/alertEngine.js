/**
 * RASTA Alert Engine
 *
 * Pure function that derives Track A and Track B alerts from the current risk state.
 * It does NOT hold independent state — it is called by the store whenever risk changes.
 *
 * Rules (architecture.md Section 4):
 *   - When any node's risk is HIGH or SEVERE:
 *       → push a Track A alert (auto-visible on Warehouse view, no approval gate)
 *       → push a Track B alert (starts `pending`, only becomes `published` after
 *         the DDMA dashboard's "Authorize" button is clicked)
 *   - When all nodes are LOW: no alerts
 *
 * Deterministic — same risk state always produces the same alerts.
 * No randomness, no timestamps that could drift, no external dependencies.
 */

/**
 * @param {object} riskLevels - { hz126: 'LOW'|'MEDIUM'|'HIGH'|'SEVERE', ... }
 * @returns {{ trackA: object|null, trackB: object|null }}
 */
export const deriveAlerts = (riskLevels) => {
  const levels = Object.values(riskLevels);
  const hasHighOrSevere = levels.some(l => l === 'HIGH' || l === 'SEVERE');
  const hasSevere = levels.some(l => l === 'SEVERE');

  if (!hasHighOrSevere) {
    return { trackA: null, trackB: null };
  }

  // Build human-readable list of affected nodes
  const severeNodes = Object.entries(riskLevels)
    .filter(([_, level]) => level === 'HIGH' || level === 'SEVERE')
    .map(([id]) => id.toUpperCase());

  const severityWord = hasSevere ? 'Severe' : 'High';

  return {
    trackA: {
      id: 'TA-1',
      type: 'trackA',
      // Track A is informational/auto — no approval gate.
      // Message is actionable for the Warehouse view (Phase 8).
      message: `${severityWord} risk on NH-29 (${severeNodes.join(', ')}). Buffer stock dispatch recommended.`,
      status: 'active',
      severity: hasSevere ? 'SEVERE' : 'HIGH'
    },
    trackB: {
      id: 'TB-1',
      type: 'trackB',
      // Track B requires DDMA authorization before it reaches the Driver.
      // This is the "governed" track — see prd.md Section 4.
      message: 'Authorize reroute advisory for active fleet to NH-37.',
      status: 'pending',
      severity: hasSevere ? 'SEVERE' : 'HIGH'
    }
  };
};