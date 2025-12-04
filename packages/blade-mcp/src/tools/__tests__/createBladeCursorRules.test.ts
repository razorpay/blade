import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBladeCursorRulesHttpCallback } from '../createBladeCursorRules.js';
import * as analyticsUtils from '../../utils/analyticsUtils.js';
import * as cursorRulesUtils from '../../utils/cursorRulesUtils.js';

// Mock the analytics and utility functions
vi.mock('../../utils/analyticsUtils.js');
vi.mock('../../utils/cursorRulesUtils.js');

// Create a mock context object for tool callbacks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockContext = (): any => ({
  signal: new AbortController().signal,
  requestId: 'test-request-id',
  sendNotification: vi.fn().mockResolvedValue(undefined),
  sendRequest: vi.fn().mockResolvedValue({}),
});

describe('createBladeCursorRules Tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return cursor rule creation instructions', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockInstructions = 'Mock instructions for creating cursor rules';

    // Mock the cursorRuleCreationInstructions function
    vi.spyOn(cursorRulesUtils, 'cursorRuleCreationInstructions').mockReturnValue(mockInstructions);

    // Call the HTTP callback directly with arguments and context (HTTP returns instructions)
    const result = createBladeCursorRulesHttpCallback(
      {
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
      },
      createMockContext(),
    );

    // Verify analytics was called
    expect(analyticsUtils.sendAnalytics).toHaveBeenCalledWith({
      eventName: expect.any(String),
      properties: {
        toolName: 'create_blade_cursor_rules',
        cursorRulesVersion: expect.any(String),
        rootDirectoryName: expect.any(String),
      },
    });

    // Verify the result structure
    expect(result).toHaveProperty('content');
    if ('content' in result && !('isError' in result)) {
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty('type', 'text');
      if ('text' in result.content[0]) {
        expect(result.content[0].text).toBe(mockInstructions);
      }
    }

    // Verify cursorRuleCreationInstructions was called with correct parameter
    expect(cursorRulesUtils.cursorRuleCreationInstructions).toHaveBeenCalledWith({
      currentProjectRootDirectory: mockCurrentProjectRootDirectory,
    });
  });
});
