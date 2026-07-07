import { StadiumGraph, StadiumNodes } from '@smart-stadiums/shared';

export const mockNodes: StadiumNodes = {
  'gate-a': { id: 'gate-a', label: 'Gate A (North)', zoneId: 'zone-north' },
  'gate-b': { id: 'gate-b', label: 'Gate B (South)', zoneId: 'zone-south' },
  'concourse-north': { id: 'concourse-north', label: 'North Concourse', zoneId: 'zone-north' },
  'concourse-south': { id: 'concourse-south', label: 'South Concourse', zoneId: 'zone-south' },
  'concourse-east': { id: 'concourse-east', label: 'East Concourse', zoneId: 'zone-east' },
  'concourse-west': { id: 'concourse-west', label: 'West Concourse', zoneId: 'zone-west' },
  'block-101': { id: 'block-101', label: 'Seating Block 101', zoneId: 'zone-north' },
  'block-102': { id: 'block-102', label: 'Seating Block 102', zoneId: 'zone-south' },
  'restroom-north': { id: 'restroom-north', label: 'North Restrooms', zoneId: 'zone-north' },
  'food-east': { id: 'food-east', label: 'East Food Stand', zoneId: 'zone-east' },
  'ramp-1': { id: 'ramp-1', label: 'Accessible Ramp 1', zoneId: 'zone-east' },
  'stairs-1': { id: 'stairs-1', label: 'Stairs 1', zoneId: 'zone-east' },
};

export const mockGraph: StadiumGraph = {
  'gate-a': [
    { toNodeId: 'concourse-north', distance: 50, stairsOnly: false, baseCongestionWeight: 1 },
  ],
  'gate-b': [
    { toNodeId: 'concourse-south', distance: 50, stairsOnly: false, baseCongestionWeight: 1 },
  ],
  'concourse-north': [
    { toNodeId: 'gate-a', distance: 50, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'concourse-east', distance: 100, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'concourse-west', distance: 100, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'block-101', distance: 20, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'restroom-north', distance: 15, stairsOnly: false, baseCongestionWeight: 1 },
  ],
  'concourse-south': [
    { toNodeId: 'gate-b', distance: 50, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'concourse-east', distance: 100, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'concourse-west', distance: 100, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'block-102', distance: 20, stairsOnly: false, baseCongestionWeight: 1 },
  ],
  'concourse-east': [
    { toNodeId: 'concourse-north', distance: 100, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'concourse-south', distance: 100, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'food-east', distance: 10, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'ramp-1', distance: 30, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'stairs-1', distance: 10, stairsOnly: true, baseCongestionWeight: 1 },
  ],
  'concourse-west': [
    { toNodeId: 'concourse-north', distance: 100, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'concourse-south', distance: 100, stairsOnly: false, baseCongestionWeight: 1 },
  ],
  'block-101': [
    { toNodeId: 'concourse-north', distance: 20, stairsOnly: false, baseCongestionWeight: 1 },
  ],
  'block-102': [
    { toNodeId: 'concourse-south', distance: 20, stairsOnly: false, baseCongestionWeight: 1 },
  ],
  'restroom-north': [
    { toNodeId: 'concourse-north', distance: 15, stairsOnly: false, baseCongestionWeight: 1 },
  ],
  'food-east': [
    { toNodeId: 'concourse-east', distance: 10, stairsOnly: false, baseCongestionWeight: 1 },
  ],
  'ramp-1': [
    { toNodeId: 'concourse-east', distance: 30, stairsOnly: false, baseCongestionWeight: 1 },
    { toNodeId: 'block-101', distance: 60, stairsOnly: false, baseCongestionWeight: 1 },
  ],
  'stairs-1': [
    { toNodeId: 'concourse-east', distance: 10, stairsOnly: true, baseCongestionWeight: 1 },
    { toNodeId: 'block-101', distance: 20, stairsOnly: true, baseCongestionWeight: 1 }, // Shortcut for non-accessible
  ]
};

/**
 * Pure function to retrieve a node by ID.
 * Returns undefined if not found.
 */
export function getNode(id: string) {
  return mockNodes[id];
}

/**
 * Pure function to retrieve edges for a given node ID.
 * Returns empty array if none found.
 */
export function getEdges(id: string) {
  return mockGraph[id] || [];
}
