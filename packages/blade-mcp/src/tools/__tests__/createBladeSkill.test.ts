import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBladeSkillHttpCallback } from '../createBladeSkill.js';
import * as analyticsUtils from '../../utils/analyticsUtils.js';
import * as skillUtils from '../../utils/skillUtils.js';

// Mock the analytics and utility functions
vi.mock('../../utils/analyticsUtils.js');
vi.mock('../../utils/skillUtils.js');

// Create a mock context object for tool callbacks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockContext = (): any => ({
  signal: new AbortController().signal,
  requestId: 'test-request-id',
  sendNotification: vi.fn().mockResolvedValue(undefined),
  sendRequest: vi.fn().mockResolvedValue({}),
});

describe('createBladeSkill Tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return skill creation instructions', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockInstructions = 'Mock instructions for creating blade skill';

    // Mock the skillCreationInstructions function
    vi.spyOn(skillUtils, 'skillCreationInstructions').mockReturnValue(mockInstructions);

    // Call the HTTP callback directly with arguments and context (HTTP returns instructions)
    const result = createBladeSkillHttpCallback(
      {
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
      },
      createMockContext(),
    );

    // Verify analytics was called
    expect(analyticsUtils.sendAnalytics).toHaveBeenCalledWith({
      eventName: expect.any(String),
      properties: {
        toolName: 'create_blade_skill',
        skillVersion: expect.any(String),
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

    // Verify skillCreationInstructions was called with correct parameter
    expect(skillUtils.skillCreationInstructions).toHaveBeenCalledWith({
      currentProjectRootDirectory: mockCurrentProjectRootDirectory,
    });
  });
});
