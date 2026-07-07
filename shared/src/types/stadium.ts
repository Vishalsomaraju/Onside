export type MatchPhase = 'pre-match' | 'in-progress' | 'halftime' | 'post-match';

export type CongestionLevel = 'low' | 'medium' | 'high';

export interface StadiumNode {
  id: string;
  label: string;
  zoneId: string;
}

export interface StadiumEdge {
  toNodeId: string;
  distance: number;
  stairsOnly: boolean;
  baseCongestionWeight: number; // typically 1, multiplier applied later
}

// Representing the graph as an adjacency list
export type StadiumGraph = Record<string, StadiumEdge[]>;
export type StadiumNodes = Record<string, StadiumNode>;

export interface RouteStep {
  nodeId: string;
  label: string;
  distanceToNext: number;
  congestionLevel: CongestionLevel;
  requiresAccessibleDetour: boolean;
}

export type RouteResult =
  | {
      success: true;
      steps: RouteStep[];
      totalDistance: number;
    }
  | {
      success: false;
      reason: 'no_route_found' | 'invalid_nodes';
    };
