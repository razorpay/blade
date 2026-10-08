import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBladePatternDocsHttpCallback } from '../getBladePatternDocs.js';
import * as analyticsUtils from '../../utils/analyticsUtils.js';
import * as skillUtils from '../../utils/skillUtils.js';
import * as getBladeDocsResponseText from '../../utils/getBladeDocsResponseText.js';
import * as generalUtils from '../../utils/generalUtils.js';
import * as detectFramework from '../../utils/detectFramework.js';
import { SKILL_VERSION } from '../../utils/tokens.js';

// Mock the analytics and utility functions
vi.mock('../../utils/analyticsUtils.js', async () => {
  const actual = await vi.importActual<typeof analyticsUtils>('../../utils/analyticsUtils.js');
  return {
    ...actual,
    sendAnalytics: vi.fn(),
  };
});
vi.mock('../../utils/skillUtils.js');
vi.mock('../../utils/getBladeDocsResponseText.js');
vi.mock('../../utils/generalUtils.js', async (importOriginal) => {
  const actual = await importOriginal<typeof generalUtils>();
  return {
    ...actual,
    getBladeDocsList: vi.fn(() => ['ListView', 'DetailedView', 'FormGroup']),
  };
});
vi.mock('../../utils/detectFramework.js', () => ({
  detectFrameworkFromProject: vi.fn(() => 'react'),
}));
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...(actual as object),
    readFileSync: vi.fn(() => 'Mock pattern guide content'),
    existsSync: vi.fn(() => false),
  };
});

// Create a mock context object for tool callbacks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockContext = (): any => ({
  signal: new AbortController().signal,
  requestId: 'test-request-id',
  sendNotification: vi.fn().mockResolvedValue(undefined),
  sendRequest: vi.fn().mockResolvedValue({}),
});

describe('getBladePatternDocs Tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mocks
    vi.spyOn(generalUtils, 'getBladeDocsList').mockReturnValue([
      'ListView',
      'DetailedView',
      'FormGroup',
    ]);
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);
    vi.spyOn(detectFramework, 'detectFrameworkFromProject').mockReturnValue('react');
  });

  it('should return pattern docs for valid patterns', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockPatternsList = 'ListView, DetailedView';
    const mockResponseText = 'Mock pattern documentation';

    // Mock the getBladeDocsResponseText function
    vi.spyOn(getBladeDocsResponseText, 'getBladeDocsResponseText').mockReturnValue(
      mockResponseText,
    );

    // Get the HTTP callback
    const httpCallback = getBladePatternDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        patternsList: mockPatternsList,
        framework: 'react',
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Verify analytics was called
    expect(analyticsUtils.sendAnalytics).toHaveBeenCalledWith({
      eventName: expect.any(String),
      properties: {
        toolName: 'get_blade_pattern_docs',
        patternsList: mockPatternsList,
        framework: 'react',
        rootDirectoryName: 'project',
        skillVersion: SKILL_VERSION,
        clientName: 'cursor',
      },
    });

    // Verify the result structure
    expect(result).toHaveProperty('content');
    if ('content' in result && !('isError' in result)) {
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty('type', 'text');
      if ('text' in result.content[0]) {
        expect(result.content[0].text).toContain(mockResponseText);
        expect(result.content[0].text).toContain('get_blade_component_docs');
      }
    }

    // Verify getBladeDocsResponseText was called with correct parameters
    expect(getBladeDocsResponseText.getBladeDocsResponseText).toHaveBeenCalledWith({
      docsList: mockPatternsList,
      documentationType: 'patterns',
      framework: 'react',
    });
  });

  it('should auto-detect svelte framework and return unavailable message', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/svelte-project';
    const mockPatternsList = 'ListView';

    vi.spyOn(detectFramework, 'detectFrameworkFromProject').mockReturnValue('svelte');

    const result = getBladePatternDocsHttpCallback(
      {
        patternsList: mockPatternsList,
        framework: undefined,
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    expect(detectFramework.detectFrameworkFromProject).toHaveBeenCalledWith(
      mockCurrentProjectRootDirectory,
    );
    expect(getBladeDocsResponseText.getBladeDocsResponseText).not.toHaveBeenCalled();
    expect(result).toHaveProperty('content');
    if ('content' in result && !('isError' in result)) {
      expect(result.content[0]).toHaveProperty('type', 'text');
      if ('text' in result.content[0]) {
        expect(result.content[0].text).toContain('framework="react" only');
      }
    }
  });

  it('should return error for invalid patterns', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockPatternsList = 'InvalidPattern, AnotherInvalid';

    // Get the HTTP callback
    const httpCallback = getBladePatternDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        patternsList: mockPatternsList,
        framework: 'react',
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Verify the result is an error
    expect(result).toBeDefined();
    expect(result).toHaveProperty('isError', true);
    if ('isError' in result && result.isError) {
      expect(result).toMatchObject({
        content: [
          {
            type: 'text',
            text: expect.any(String),
          },
        ],
      });
    }

    // Verify analytics was not called for invalid patterns
    expect(analyticsUtils.sendAnalytics).not.toHaveBeenCalled();
  });

  it('should return consistent pattern docs response (snapshot)', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testPatternsList = 'FormGroup';

    // Unmock fs first so that getBladeDocsResponseText can read real files
    vi.doUnmock('fs');

    // Get the actual implementations (not mocked) to test real output
    // Re-import getBladeDocsResponseText after unmocking fs so it uses actual readFileSync
    vi.doUnmock('../../utils/getBladeDocsResponseText.js');
    const actualGetBladeDocsResponseText = await vi.importActual<typeof getBladeDocsResponseText>(
      '../../utils/getBladeDocsResponseText.js',
    );
    const actualGeneralUtils = await vi.importActual<typeof generalUtils>(
      '../../utils/generalUtils.js',
    );

    // Unmock analytics to allow the actual function to run, but we'll still spy on it
    vi.restoreAllMocks();
    vi.spyOn(analyticsUtils, 'sendAnalytics').mockImplementation(() => {
      // Mock implementation that doesn't throw
    });

    if (actualGetBladeDocsResponseText && actualGeneralUtils) {
      // Temporarily replace the mocked functions with the actual ones
      vi.spyOn(getBladeDocsResponseText, 'getBladeDocsResponseText').mockImplementation(
        actualGetBladeDocsResponseText.getBladeDocsResponseText,
      );
      vi.spyOn(generalUtils, 'getBladeDocsList').mockImplementation(
        actualGeneralUtils.getBladeDocsList,
      );
    }

    // Mock skill as not needing update
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);

    // Get the HTTP callback
    const httpCallback = getBladePatternDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        patternsList: testPatternsList,
        framework: 'react',
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });

  it('should return consistent pattern docs response for claude agent', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testPatternsList = 'FormGroup';

    // Unmock fs first so that getBladeDocsResponseText can read real files
    vi.doUnmock('fs');

    // Get the actual implementations (not mocked) to test real output
    // Re-import getBladeDocsResponseText after unmocking fs so it uses actual readFileSync
    vi.doUnmock('../../utils/getBladeDocsResponseText.js');
    const actualGetBladeDocsResponseText = await vi.importActual<typeof getBladeDocsResponseText>(
      '../../utils/getBladeDocsResponseText.js',
    );
    const actualGeneralUtils = await vi.importActual<typeof generalUtils>(
      '../../utils/generalUtils.js',
    );

    // Unmock analytics to allow the actual function to run, but we'll still spy on it
    vi.restoreAllMocks();
    vi.spyOn(analyticsUtils, 'sendAnalytics').mockImplementation(() => {
      // Mock implementation that doesn't throw
    });

    if (actualGetBladeDocsResponseText && actualGeneralUtils) {
      // Temporarily replace the mocked functions with the actual ones
      vi.spyOn(getBladeDocsResponseText, 'getBladeDocsResponseText').mockImplementation(
        actualGetBladeDocsResponseText.getBladeDocsResponseText,
      );
      vi.spyOn(generalUtils, 'getBladeDocsList').mockImplementation(
        actualGeneralUtils.getBladeDocsList,
      );
    }

    // Mock skill as not needing update
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);

    // Get the HTTP callback
    const httpCallback = getBladePatternDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        patternsList: testPatternsList,
        framework: 'react',
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'claude',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });
});
