import { mockGraph, mockNodes, getEdges, getNode } from '../graph';

describe('Graph Validation', () => {
  it('should not have any orphan nodes', () => {
    // Every node in mockNodes should appear either as a key in mockGraph 
    // or as a toNodeId in some edge
    const allNodeIds = Object.keys(mockNodes);
    
    for (const nodeId of allNodeIds) {
      const hasOutbound = mockGraph[nodeId] && mockGraph[nodeId].length > 0;
      
      let hasInbound = false;
      for (const origin in mockGraph) {
        if (mockGraph[origin].some(edge => edge.toNodeId === nodeId)) {
          hasInbound = true;
          break;
        }
      }
      
      expect(hasOutbound || hasInbound).toBe(true);
    }
  });

  it('should not have any dangling edges', () => {
    // Every toNodeId must exist in mockNodes
    for (const origin in mockGraph) {
      const edges = mockGraph[origin];
      for (const edge of edges) {
        expect(mockNodes[edge.toNodeId]).toBeDefined();
      }
    }
  });

  it('getNode and getEdges should return expected results', () => {
    expect(getNode('gate-a')).toBeDefined();
    expect(getNode('invalid')).toBeUndefined();

    expect(getEdges('gate-a').length).toBeGreaterThan(0);
    expect(getEdges('invalid')).toEqual([]);
  });
});
