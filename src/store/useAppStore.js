import { create } from 'zustand';
import { generateWeather } from '../simulation/weatherSimulator';
import { evaluateHazardRisk } from '../simulation/riskEngine';
import { computeRoute } from '../simulation/routingEngine';
import { deriveAlerts } from '../simulation/alertEngine';
import { submitReport, clearQueue } from '../simulation/syncQueue';

const NODES = ['hz126', 'hz164', 'hz175'];

export const useAppStore = create((set, get) => ({
  // --- State ---
  stormActive: false,
  truckWeight: 12,
  rainfall: { hz126: { rain24h: 5, rain72h: 10 }, hz164: { rain24h: 2, rain72h: 8 }, hz175: { rain24h: 4, rain72h: 12 } },
  riskLevels: { hz126: 'LOW', hz164: 'LOW', hz175: 'LOW' },
  activeRoute: 'NH-29',
  routeDetails: { path: ['dimapur', 'hz126', 'hz164', 'hz175', 'imphal'], totalTime: 5.5, excludedEdges: [], isHoldingPlaza: false },

  // Fleet state (Phase 4)
  fleetStep: 0,
  fleetRunning: false,

  // Alerts (Phase 5)
  alerts: { trackA: null, trackB: null },

  // Field report (Phase 7)
  fieldReport: { status: 'idle' },
  formResetSignal: 0,

  // Warehouse (Phase 8)
  warehouseDispatchAcknowledged: false,

  selectedNode: null,

  // --- Actions ---
  setSelectedNode: (nodeId) => set({ selectedNode: nodeId }),

  recomputeRoute: () => {
    const { truckWeight, riskLevels } = get();
    const routeDetails = computeRoute(truckWeight, riskLevels);
    set({
      activeRoute: routeDetails.routeId === 'HOLDING' ? 'NONE' : routeDetails.routeId,
      routeDetails,
      fleetStep: 0
    });
  },

  // Fleet controls
  startFleet: () => set({ fleetRunning: true }),
  stopFleet: () => set({ fleetRunning: false }),
  advanceFleet: () => {
    const { routeDetails, fleetStep } = get();
    if (!routeDetails || !routeDetails.path || routeDetails.path.length === 0) return;
    const maxStep = routeDetails.path.length - 1;
    const nextStep = fleetStep >= maxStep ? 0 : fleetStep + 1;
    set({ fleetStep: nextStep });
  },

  resetDemo: () => {
    const weather = generateWeather(false);
    const risks = {};
    NODES.forEach(node => {
      risks[node] = evaluateHazardRisk(weather[node].rain24h, weather[node].rain72h).level;
    });
    const routeDetails = computeRoute(12, risks);
    const alerts = deriveAlerts(risks);

    clearQueue();

    set({
      stormActive: false,
      truckWeight: 12,
      rainfall: weather,
      riskLevels: risks,
      activeRoute: routeDetails.routeId,
      routeDetails,
      fleetStep: 0,
      fleetRunning: false,
      alerts,
      fieldReport: { status: 'idle' },
      formResetSignal: get().formResetSignal + 1,
      warehouseDispatchAcknowledged: false, // Phase 8 reset
      selectedNode: null
    });
  },

  triggerStorm: () => {
    const weather = generateWeather(true);
    const risks = {};
    NODES.forEach(node => {
      risks[node] = evaluateHazardRisk(weather[node].rain24h, weather[node].rain72h).level;
    });
    const routeDetails = computeRoute(get().truckWeight, risks);
    const alerts = deriveAlerts(risks);

    set({
      stormActive: true,
      rainfall: weather,
      riskLevels: risks,
      activeRoute: routeDetails.routeId === 'HOLDING' ? 'NONE' : routeDetails.routeId,
      routeDetails,
      fleetStep: 0,
      alerts,
      fleetSpeedDrop: true,
      warehouseDispatchAcknowledged: false // Reset on new storm
    });
  },

  setTruckWeight: (weight) => {
    set({ truckWeight: weight });
    get().recomputeRoute();
  },

  authorizeAlert: () => set((state) => ({
    alerts: {
      ...state.alerts,
      trackB: state.alerts.trackB ? { ...state.alerts.trackB, status: 'published' } : null
    }
  })),

  submitFieldReport: async (report) => {
    set({ fieldReport: { status: 'saving' } });
    
    try {
      await submitReport(report);
      set({ fieldReport: { status: 'synced' } });
      
      setTimeout(() => {
        if (get().fieldReport.status === 'synced') {
          set({ fieldReport: { status: 'idle' } });
        }
      }, 5000);
    } catch (error) {
      console.error('Sync failed:', error);
      set({ fieldReport: { status: 'idle' } });
    }
  },

  // Phase 8: Acknowledge warehouse dispatch
  acknowledgeWarehouseDispatch: () => set({ warehouseDispatchAcknowledged: true })
}));