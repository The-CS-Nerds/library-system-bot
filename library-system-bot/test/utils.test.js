import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { parseCheckCommand } from '../src/utils/command-parser.js';
import { pickPriorityLabel, getContentNodeId, hasLabel } from '../src/utils/helpers.js';

describe('Command Parser', () => {
  it('should parse check command with branch only', () => {
    const text = '@library-system-bot check --branch=main';
    const result = parseCheckCommand(text);
    
    assert.strictEqual(result.type, 'check');
    assert.strictEqual(result.branch, 'main');
    assert.strictEqual(result.command, 'docker-compose -f docker-compose.yml build');
  });

  it('should parse check command with custom command', () => {
    const text = '@library-system-bot check --branch=feature/test --command=npm run test';
    const result = parseCheckCommand(text);
    
    assert.strictEqual(result.type, 'check');
    assert.strictEqual(result.branch, 'feature/test');
    assert.strictEqual(result.command, 'npm run test');
  });

  it('should parse help command', () => {
    const text = '@library-system-bot help';
    const result = parseCheckCommand(text);
    
    assert.strictEqual(result.type, 'help');
  });

  it('should return null for invalid command', () => {
    const text = '@library-system-bot invalid';
    const result = parseCheckCommand(text);
    
    assert.strictEqual(result, null);
  });
});

describe('Helper Functions', () => {
  describe('pickPriorityLabel', () => {
    it('should find priority label from direct label', () => {
      const payload = {
        label: { name: 'p0' }
      };
      
      assert.strictEqual(pickPriorityLabel(payload), 'p0');
    });

    it('should find priority label from issue labels', () => {
      const payload = {
        issue: {
          labels: [
            { name: 'bug' },
            { name: 'p2' },
            { name: 'frontend' }
          ]
        }
      };
      
      assert.strictEqual(pickPriorityLabel(payload), 'p2');
    });

    it('should return null when no priority label exists', () => {
      const payload = {
        issue: {
          labels: [
            { name: 'bug' },
            { name: 'frontend' }
          ]
        }
      };
      
      assert.strictEqual(pickPriorityLabel(payload), null);
    });
  });

  describe('getContentNodeId', () => {
    it('should get node_id from issue', () => {
      const payload = {
        issue: { node_id: 'ISSUE_123' }
      };
      
      assert.strictEqual(getContentNodeId(payload), 'ISSUE_123');
    });

    it('should get node_id from pull_request', () => {
      const payload = {
        pull_request: { node_id: 'PR_456' }
      };
      
      assert.strictEqual(getContentNodeId(payload), 'PR_456');
    });

    it('should return null when no node_id exists', () => {
      const payload = {};
      
      assert.strictEqual(getContentNodeId(payload), null);
    });
  });

  describe('hasLabel', () => {
    it('should find label in array', () => {
      const labels = [
        { name: 'bug' },
        { name: 'p1' }
      ];
      
      assert.strictEqual(hasLabel(labels, 'bug'), true);
    });

    it('should return false when label not in array', () => {
      const labels = [
        { name: 'bug' },
        { name: 'p1' }
      ];
      
      assert.strictEqual(hasLabel(labels, 'feature'), false);
    });

    it('should handle string labels', () => {
      const labels = ['bug', 'p1'];
      
      assert.strictEqual(hasLabel(labels, 'bug'), true);
    });
  });
});
