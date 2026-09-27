/**
 * RASTA Routing Engine
 * 
 * Stage 1: Hard filter — remove edges whose bridge_limit < truck_weight
 * Stage 2: Dijkstra shortest-path with risk-weighted edges
 * 
 * Edge weight = base_time_hrs × risk_penalty
 * Risk penalty comes from riskEngine.js for the hazard node on that edge.
 * SEVERE risk → edge excluded entirely (impassable).
 * 
 * Graph topology (from architecture.md Section 3):
 *   NH-29: Dimapur → HZ-126 → HZ-164 → HZ-175 → Imphal
 *   NH-37: Dimapur → Badarpur → Jiribam → Imphal
 * 
 * The HZ-126 → HZ-164 edge has a 15t bridge limit (Zubza) —
 * this is the deliberately weak bridge used to demonstrate the Stage-1 hard filter.
 */

const GRAPH = {
  nodes: ['dimapur', 'hz126', 'hz164', 'hz175', 'imphal', 'badarpur_nh37', 'jiribam_nh37'],
  edges: [
    // NH-29 primary route
    { from: 'dimapur', to: 'hz126', baseTime: 0.5, bridgeLimit: 40, hazardNode: 'hz126' },
    { from: 'hz126', to: 'hz164', baseTime: 1.0, bridgeLimit: 15, hazardNode: 'hz164' }, // 15t weak bridge at Zubza
    { from: 'hz164', to: 'hz175', baseTime: 0.5, bridgeLimit: 40, hazardNode: 'hz175' },
    { from: 'hz175', to: 'imphal', baseTime: 3.5, bridgeLimit: 40, hazardNode: null },
    
    // NH-37 alternate route
    { from: 'dimapur', to: 'badarpur_nh37', baseTime: 4.0, bridgeLimit: 40, hazardNode: null },
    { from: 'badarpur_nh37', to: 'jiribam_nh37', baseTime: 2.5, bridgeLimit: 40, hazardNode: null },
    { from: 'jiribam_nh37', to: 'imphal', baseTime: 2.0, bridgeLimit: 40, hazardNode: null }
  ]
};

/**
 * Computes the optimal route given truck weight and current risk levels.
 * 
 * @param {number} truckWeight - Truck weight in tons (e.g., 12 or 25)
 * @param {object} riskLevels - { hz126: 'LOW'|'MEDIUM'|'HIGH'|'SEVERE', ... }
 * @returns {object} { routeId, path, totalTime, excludedEdges, isHoldingPlaza }
 */
export const computeRoute = (truckWeight, riskLevels) => {
  // Stage 1: Hard filter — remove edges below truck weight
  const filteredEdges = GRAPH.edges.filter(edge => edge.bridgeLimit >= truckWeight);
  const excludedEdges = GRAPH.edges.filter(edge => edge.bridgeLimit < truckWeight);

  // Stage 2: Dijkstra with risk-weighted edges
  // Penalties match riskEngine.js thresholds — transparent, rule-based, matches pitch deck.
  const riskPenalties = {
    LOW: 1.0,
    MEDIUM: 1.5,
    HIGH: 3.0,
    SEVERE: Infinity // Impassable — edge excluded entirely
  };

  // Build adjacency list with weighted edges
  const adjacency = {};
  GRAPH.nodes.forEach(node => { adjacency[node] = []; });

  filteredEdges.forEach(edge => {
    // Skip edges where the hazard node is SEVERE (impassable)
    if (edge.hazardNode && riskLevels[edge.hazardNode] === 'SEVERE') {
      return;
    }

    const penalty = edge.hazardNode ? riskPenalties[riskLevels[edge.hazardNode]] : 1.0;
    const weight = edge.baseTime * penalty;

    adjacency[edge.from].push({ to: edge.to, weight, edge });
  });

  // Dijkstra's algorithm
  const distances = {};
  const previous = {};
  const unvisited = new Set(GRAPH.nodes);

  GRAPH.nodes.forEach(node => { distances[node] = Infinity; });
  distances['dimapur'] = 0;

  while (unvisited.size > 0) {
    let currentNode = null;
    let minDist = Infinity;
    unvisited.forEach(node => {
      if (distances[node] < minDist) {
        minDist = distances[node];
        currentNode = node;
      }
    });

    if (currentNode === null || currentNode === 'imphal') break;

    unvisited.delete(currentNode);

    adjacency[currentNode].forEach(({ to, weight }) => {
      if (!unvisited.has(to)) return;
      const alt = distances[currentNode] + weight;
      if (alt < distances[to]) {
        distances[to] = alt;
        previous[to] = { from: currentNode };
      }
    });
  }

  // No through-route available — holding plaza fallback
  if (distances['imphal'] === Infinity) {
    return {
      routeId: 'HOLDING',
      path: [],
      totalTime: 0,
      excludedEdges,
      isHoldingPlaza: true,
      message: 'All routes impassable. Route to nearest holding plaza.'
    };
  }

  // Reconstruct path
  const path = [];
  let current = 'imphal';
  while (current !== 'dimapur') {
    path.unshift(current);
    current = previous[current].from;
  }
  path.unshift('dimapur');

  // Determine which route this is (NH-29 or NH-37)
  const routeId = path.includes('hz126') || path.includes('hz164') || path.includes('hz175') ? 'NH-29' : 'NH-37';

  return {
    routeId,
    path,
    totalTime: distances['imphal'],
    excludedEdges,
    isHoldingPlaza: false
  };
};