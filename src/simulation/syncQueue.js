/**
 * RASTA Sync Queue
 *
 * Simulates an offline-first report queue. In production this would use
 * IndexedDB + a service worker to persist reports while offline and sync
 * them when connectivity returns. For this demo prototype, we simulate
 * the entire flow in-memory — see rules.md Section 1 and architecture.md
 * Section 4 for why.
 *
 * Flow:
 *   1. submitReport(report) is called with a report object
 *   2. Report is pushed to an in-memory queue with status: 'pending'
 *   3. A 3-second timer starts (simulating "waiting for signal")
 *   4. On timeout, the report's status flips to 'synced'
 *   5. The Promise resolves with the synced report
 *
 * This is intentionally deterministic — the 3-second delay is fixed,
 * not random, so the presenter can reliably point at the transition
 * during the pitch.
 */

const SYNC_DELAY_MS = 3000;

// In-memory queue (simulates IndexedDB)
const queue = [];

/**
 * @param {object} report - { photo: string|null, status: 'OPEN'|'RESTRICTED'|'BLOCKED', notes: string }
 * @returns {Promise<object>} - resolves with the synced report after 3s
 */
export const submitReport = (report) => {
  const reportWithId = {
    ...report,
    id: `RPT-${Date.now()}`,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  queue.push(reportWithId);

  return new Promise((resolve) => {
    setTimeout(() => {
      // Flip status to synced
      reportWithId.status = 'synced';
      reportWithId.syncedAt = new Date().toISOString();
      resolve(reportWithId);
    }, SYNC_DELAY_MS);
  });
};

/**
 * Returns the current queue (for debugging/inspection)
 */
export const getQueue = () => [...queue];

/**
 * Clears the queue (used by resetDemo)
 */
export const clearQueue = () => {
  queue.length = 0;
};