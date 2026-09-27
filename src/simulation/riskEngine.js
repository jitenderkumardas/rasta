/**
 * Evaluates hazard risk based on rainfall thresholds.
 * Thresholds derived from IIT Kharagpur study on moisture-driven landslides.
 * @param {number} rain24h - Rainfall in last 24 hours (mm)
 * @param {number} rain72h - Rainfall in last 72 hours (mm)
 * @returns {object} { level, penalty, etaToBlock }
 */
export const evaluateHazardRisk = (rain24h, rain72h) => {
  if (rain24h > 120 || rain72h > 250) {
    return { level: 'SEVERE', penalty: 999, etaToBlock: 'Immediate' }; // Effectively impassable
  }
  if (rain24h > 80 || rain72h > 150) {
    return { level: 'HIGH', penalty: 3.0, etaToBlock: '2–4 hours' };
  }
  if (rain24h > 40) {
    return { level: 'MEDIUM', penalty: 1.5, etaToBlock: '6–8 hours' };
  }
  return { level: 'LOW', penalty: 1.0, etaToBlock: 'N/A' };
};