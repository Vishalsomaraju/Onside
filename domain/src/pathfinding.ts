import { MatchPhase, RouteResult, RouteStep } from '@smart-stadiums/shared';
import { getNode, getEdges } from './graph';
import { getCongestion, getCongestionMultiplier } from './congestion';

interface PriorityQueueNode {
  id: string;
  cost: number;
}

/**
 * Pure function to compute the shortest path using Dijkstra's algorithm.
 * Accounts for real-time congestion weights and accessibility constraints.
 */
// eslint-disable-next-line complexity -- Standard Dijkstra implementation requires multiple loops and conditions
export function findRoute(
  originId: string,
  destinationId: string,
  matchPhase: MatchPhase,
  accessibilityRequired: boolean
): RouteResult {
  const originNode = getNode(originId);
  const destinationNode = getNode(destinationId);

  if (!originNode || !destinationNode) {
    return { success: false, reason: 'invalid_nodes' };
  }

  if (originId === destinationId) {
    return { success: true, steps: [], totalDistance: 0 };
  }

  // Cost to reach a node
  const distances: Record<string, number> = {};
  // Track the path back
  const previous: Record<string, string | null> = {};
  
  const pq: PriorityQueueNode[] = [];

  // Initialize
  distances[originId] = 0;
  pq.push({ id: originId, cost: 0 });

  let found = false;

  while (pq.length > 0) {
    // Basic array sort for priority queue (fine for small stadium graphs)
    pq.sort((a, b) => a.cost - b.cost);
    const current = pq.shift()!;

    if (current.id === destinationId) {
      found = true;
      break;
    }

    if (current.cost > (distances[current.id] ?? Infinity)) continue;

    const edges = getEdges(current.id);
    for (const edge of edges) {
      // Accessibility filter: strictly exclude stairs if required
      if (accessibilityRequired && edge.stairsOnly) {
        continue;
      }

      const neighborNode = getNode(edge.toNodeId);
      if (!neighborNode) continue;

      const congestionLevel = getCongestion(matchPhase, neighborNode.zoneId);
      const multiplier = getCongestionMultiplier(congestionLevel);
      const dynamicCost = edge.distance * edge.baseCongestionWeight * multiplier;

      const newCost = distances[current.id] + dynamicCost;

      if (distances[edge.toNodeId] === undefined || newCost < distances[edge.toNodeId]) {
        distances[edge.toNodeId] = newCost;
        previous[edge.toNodeId] = current.id;
        pq.push({ id: edge.toNodeId, cost: newCost });
      }
    }
  }

  if (!found) {
    return { success: false, reason: 'no_route_found' };
  }

  // Reconstruct path
  const steps: RouteStep[] = [];
  let currId = destinationId;
  let totalDistance = 0;

  // We trace backwards, but we want the steps forwards
  const pathIds: string[] = [];
  while (currId) {
    pathIds.unshift(currId);
    currId = previous[currId]!;
  }

  // Build the route steps
  for (let i = 0; i < pathIds.length - 1; i++) {
    const fromId = pathIds[i];
    const toId = pathIds[i + 1];
    
    const fromEdges = getEdges(fromId);
    const edge = fromEdges.find((e) => e.toNodeId === toId)!;
    
    const targetNode = getNode(toId)!;
    const congestion = getCongestion(matchPhase, targetNode.zoneId);
    
    steps.push({
      nodeId: toId,
      label: targetNode.label,
      distanceToNext: edge.distance,
      congestionLevel: congestion,
      requiresAccessibleDetour: accessibilityRequired && !edge.stairsOnly && hasStairsAlternative(fromId, toId)
    });
    
    totalDistance += edge.distance;
  }

  return {
    success: true,
    steps,
    totalDistance
  };
}

/**
 * Helper to determine if taking this accessible route was a detour
 * compared to a non-accessible shortcut.
 */
function hasStairsAlternative(fromId: string, _toId: string): boolean {
  const edges = getEdges(fromId);
  // If there's an edge to somewhere else that is stairs-only, we might have taken a detour.
  // For simplicity, just check if any edge from `fromId` is stairsOnly.
  return edges.some(e => e.stairsOnly);
}
