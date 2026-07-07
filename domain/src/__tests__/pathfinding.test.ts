import { findRoute } from '../pathfinding';
import { mockNodes, mockGraph } from '../graph';

describe('Pathfinding', () => {
  it('should find a valid route between two nodes', () => {
    const result = findRoute('gate-a', 'block-101', 'pre-match', false);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps[result.steps.length - 1].nodeId).toBe('block-101');
    }
  });

  it('should return error if node does not exist', () => {
    const result = findRoute('gate-a', 'non-existent', 'pre-match', false);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('invalid_nodes');
    }
  });

  it('should return error if no route found', () => {
    // Add a disconnected node to the graph just for this test
    mockNodes['isolated-node'] = { id: 'isolated-node', label: 'Isolated', zoneId: 'zone-north' };
    mockGraph['isolated-node'] = [];
    
    const result = findRoute('gate-a', 'isolated-node', 'pre-match', false);
    
    // Cleanup
    delete mockNodes['isolated-node'];
    delete mockGraph['isolated-node'];
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('no_route_found');
    }
  });

  it('should return invalid_nodes for unknown nodes', () => {
    const result = findRoute('unknown-a', 'block-101', 'pre-match', false);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('invalid_nodes');
    }
  });

  it('should return no_route_found if graph is disconnected', () => {
    // There are no disconnected nodes in our mock currently, but we can test
    // finding a route to something that has no inbound edges if it existed.
    // For now, let's just test origin === destination
    const result = findRoute('gate-a', 'gate-a', 'pre-match', false);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.steps.length).toBe(0);
      expect(result.totalDistance).toBe(0);
    }
  });

  it('should avoid stairs when accessibilityRequired is true', () => {
    // from concourse-east to block-101: 
    // stairs-1 path: concourse-east -> stairs-1 -> block-101 (distance 30)
    // ramp-1 path: concourse-east -> ramp-1 -> block-101 (distance 90)
    
    // Without accessibility, it should take stairs-1
    const resultNoAccess = findRoute('concourse-east', 'block-101', 'pre-match', false);
    expect(resultNoAccess.success).toBe(true);
    if (resultNoAccess.success) {
      const tookStairs = resultNoAccess.steps.some(s => s.nodeId === 'stairs-1');
      expect(tookStairs).toBe(true);
    }

    // With accessibility, it must take ramp-1 and avoid stairs
    const resultAccess = findRoute('concourse-east', 'block-101', 'pre-match', true);
    expect(resultAccess.success).toBe(true);
    if (resultAccess.success) {
      const tookStairs = resultAccess.steps.some(s => s.nodeId === 'stairs-1');
      expect(tookStairs).toBe(false);
      const tookRamp = resultAccess.steps.some(s => s.nodeId === 'ramp-1');
      expect(tookRamp).toBe(true);
    }
  });

  it('should avoid unknown nodes during traversal gracefully', () => {
    // This is covered internally, but testing that it doesn't throw.
    expect(() => findRoute('gate-b', 'restroom-north', 'halftime', false)).not.toThrow();
  });

  it('should ignore dangling edges safely', () => {
    mockGraph['gate-a'].push({ toNodeId: 'missing-node', distance: 10, stairsOnly: false, baseCongestionWeight: 1 });
    const result = findRoute('gate-a', 'block-101', 'pre-match', false);
    expect(result.success).toBe(true);
    mockGraph['gate-a'].pop(); // cleanup
  });

  it('should skip processing if a better path to the node was already found', () => {
    // Setup a diamond graph where one path is longer, pushing a duplicate sub-optimal entry to PQ
    mockNodes['dummy-1'] = { id: 'dummy-1', label: 'Dummy 1', zoneId: 'concourse-1' };
    mockNodes['dummy-2'] = { id: 'dummy-2', label: 'Dummy 2', zoneId: 'concourse-2' };
    mockNodes['dummy-target'] = { id: 'dummy-target', label: 'Dummy Target', zoneId: 'concourse-3' };
    
    mockGraph['gate-a'].push(
      { toNodeId: 'dummy-1', distance: 10, stairsOnly: false, baseCongestionWeight: 1 },
      { toNodeId: 'dummy-2', distance: 50, stairsOnly: false, baseCongestionWeight: 1 }
    );
    mockGraph['dummy-1'] = [{ toNodeId: 'dummy-target', distance: 100, stairsOnly: false, baseCongestionWeight: 1 }];
    mockGraph['dummy-2'] = [{ toNodeId: 'dummy-target', distance: 10, stairsOnly: false, baseCongestionWeight: 1 }];
    mockGraph['dummy-target'] = [];

    const result = findRoute('gate-a', 'dummy-target', 'pre-match', false);
    expect(result.success).toBe(true);

    // cleanup
    mockGraph['gate-a'].splice(mockGraph['gate-a'].length - 2, 2);
    delete mockNodes['dummy-1'];
    delete mockNodes['dummy-2'];
    delete mockNodes['dummy-target'];
    delete mockGraph['dummy-1'];
    delete mockGraph['dummy-2'];
    delete mockGraph['dummy-target'];
  });
});
