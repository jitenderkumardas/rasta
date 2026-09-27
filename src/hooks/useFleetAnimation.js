import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * Drives the fleet animation by advancing the fleet step on a fixed interval.
 * The interval is cleared when fleetRunning becomes false or the component unmounts.
 *
 * Step interval is deliberately slow (1.5s) so judges can clearly see the truck
 * move from node to node. During a speed-drop, the animation tick rate stays the
 * same — only the displayed speed number changes. This keeps the demo visually
 * predictable (see rules.md Section 1).
 */
const STEP_INTERVAL_MS = 1500;

export const useFleetAnimation = () => {
  const intervalRef = useRef(null);
  const fleetRunning = useAppStore((s) => s.fleetRunning);
  const advanceFleet = useAppStore((s) => s.advanceFleet);

  useEffect(() => {
    if (fleetRunning) {
      intervalRef.current = setInterval(() => {
        advanceFleet();
      }, STEP_INTERVAL_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fleetRunning, advanceFleet]);
};