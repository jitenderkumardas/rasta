/**
 * RASTA Fleet Simulator
 *
 * Pure function that derives the truck's current state from:
 *   - the active route path (array of node IDs)
 *   - the current fleet step index
 *   - whether a storm is active
 *
 * SPEED-DROP ANOMALY (scripted, deterministic):
 *   When stormActive === true AND the truck has reached step index 2
 *   (the 3rd node on its route), the simulator flags a speed drop.
 *   This is NOT random — it is a fixed beat in the demo script so
 *   the presenter can reliably point at it (see rules.md Section 1).
 *
 *   Step index 2 was chosen because:
 *     - On NH-29 (5 nodes): it lands on HZ-164 (Zubza) — the weak bridge
 *     - On NH-37 (4 nodes): it lands on Jiribam — mid-route, visible
 *   Either way, it's clearly "mid-transit" for the judges.
 */

const SPEED_DROP_STEP_INDEX = 2;
const NORMAL_SPEED_KMH = 60;
const DROPPED_SPEED_KMH = 25;

/**
 * @param {string[]} routePath - e.g. ['dimapur','hz126','hz164','hz175','imphal']
 * @param {number} fleetStep - current step index (0-based)
 * @param {boolean} stormActive - whether storm is currently triggered
 * @returns {{ currentNode: string|null, speed: number, isSpeedDropped: boolean, message: string|null }}
 */
export const getFleetState = (routePath, fleetStep, stormActive) => {
  if (!routePath || routePath.length === 0) {
    return { currentNode: null, speed: 0, isSpeedDropped: false, message: null };
  }

  const clampedStep = Math.min(Math.max(0, fleetStep), routePath.length - 1);
  const currentNode = routePath[clampedStep];

  // Deterministic speed-drop: fires at fixed step only during storm
  const isSpeedDropped = stormActive && clampedStep === SPEED_DROP_STEP_INDEX;
  const speed = isSpeedDropped ? DROPPED_SPEED_KMH : NORMAL_SPEED_KMH;
  const message = isSpeedDropped
    ? 'Speed drop detected — hazard proximity'
    : null;

  return { currentNode, speed, isSpeedDropped, message };
};