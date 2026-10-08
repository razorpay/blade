import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBladeGeneralDocsHttpCallback } from '../getBladeGeneralDocs.js';
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
    getBladeDocsList: vi.fn(() => [
      'AvailableIcons',
      'ChartColorSystem',
      'Usage',
      'WhiteLabelling',
    ]),
  };
});
vi.mock('../../utils/detectFramework.js', () => ({
  detectFrameworkFromProject: vi.fn(() => 'react'),
}));
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...(actual as object),
    readFileSync: vi.fn(() => 'Mock guide content'),
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

describe('getBladeGeneralDocs Tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mocks
    vi.spyOn(generalUtils, 'getBladeDocsList').mockReturnValue([
      'AvailableIcons',
      'ChartColorSystem',
      'Usage',
      'WhiteLabelling',
    ]);
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);
    vi.spyOn(detectFramework, 'detectFrameworkFromProject').mockReturnValue('react');
  });

  it('should return general docs for valid topics', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockTopicsList = 'Usage, AvailableIcons';
    const mockResponseText = 'Mock general documentation';

    // Mock the getBladeDocsResponseText function
    vi.spyOn(getBladeDocsResponseText, 'getBladeDocsResponseText').mockReturnValue(
      mockResponseText,
    );

    // Get the HTTP callback
    const httpCallback = getBladeGeneralDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        topicsList: mockTopicsList,
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
        toolName: 'get_blade_general_docs',
        topicsList: mockTopicsList,
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
        expect(result.content[0].text).toBe(mockResponseText.trim());
      }
    }

    // Verify getBladeDocsResponseText was called with correct parameters
    expect(getBladeDocsResponseText.getBladeDocsResponseText).toHaveBeenCalledWith({
      docsList: mockTopicsList,
      documentationType: 'general',
      framework: 'react',
    });
  });

  it('should auto-detect framework when omitted', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/svelte-project';
    const mockTopicsList = 'Usage';
    const mockResponseText = 'Mock svelte general documentation';

    vi.spyOn(generalUtils, 'getBladeDocsList').mockReturnValue(['Usage']);
    vi.spyOn(detectFramework, 'detectFrameworkFromProject').mockReturnValue('svelte');
    vi.spyOn(getBladeDocsResponseText, 'getBladeDocsResponseText').mockReturnValue(
      mockResponseText,
    );

    getBladeGeneralDocsHttpCallback(
      {
        topicsList: mockTopicsList,
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
    expect(getBladeDocsResponseText.getBladeDocsResponseText).toHaveBeenCalledWith({
      docsList: mockTopicsList,
      documentationType: 'general',
      framework: 'svelte',
    });
  });

  it('should return error for invalid topics', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockTopicsList = 'InvalidTopic, AnotherInvalid';

    // Get the HTTP callback
    const httpCallback = getBladeGeneralDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        topicsList: mockTopicsList,
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

    // Verify analytics was not called for invalid topics
    expect(analyticsUtils.sendAnalytics).not.toHaveBeenCalled();
  });

  it('should return consistent general docs response (snapshot)', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testTopicsList = 'Usage, AvailableIcons';

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
    const httpCallback = getBladeGeneralDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        topicsList: testTopicsList,
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

  it('should return consistent general docs response for claude agent', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testTopicsList = 'Usage, AvailableIcons';

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
    const httpCallback = getBladeGeneralDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        topicsList: testTopicsList,
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
