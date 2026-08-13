import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getBladeComponentDocsHttpCallback,
  getBladeComponentDocsStdioCallback,
  getBladeComponentDocsHttpSchema,
} from '../getBladeComponentDocs.js';
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
    getBladeDocsList: vi.fn(() => ['Button', 'Accordion', 'Input']),
  };
});
vi.mock('../../utils/detectFramework.js', () => ({
  detectFrameworkFromProject: vi.fn(() => 'react'),
}));

// Create a mock context object for tool callbacks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockContext = (): any => ({
  signal: new AbortController().signal,
  requestId: 'test-request-id',
  sendNotification: vi.fn().mockResolvedValue(undefined),
  sendRequest: vi.fn().mockResolvedValue({}),
});

describe('getBladeComponentDocs Tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mocks
    vi.spyOn(generalUtils, 'getBladeDocsList').mockReturnValue(['Button', 'Accordion', 'Input']);
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);
    vi.spyOn(detectFramework, 'detectFrameworkFromProject').mockReturnValue('react');
  });

  it('should return component docs for valid components', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockComponentsList = 'Button, Accordion';
    const mockResponseText = 'Mock component documentation';

    // Mock the getBladeDocsResponseText function
    vi.spyOn(getBladeDocsResponseText, 'getBladeDocsResponseText').mockReturnValue(
      mockResponseText,
    );

    // Get the HTTP callback
    const httpCallback = getBladeComponentDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        componentsList: mockComponentsList,
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
        toolName: 'get_blade_component_docs',
        componentsList: mockComponentsList,
        framework: 'react',
        rootDirectoryName: 'project',
        skillVersion: SKILL_VERSION,
        clientName: 'cursor',
      },
    });

    // Verify the result structure
    expect(result).toHaveProperty('content');
    if ('content' in result && !('isError' in result)) {
      expect(result).toMatchObject({
        content: [
          {
            type: 'text',
            text: mockResponseText.trim(),
          },
        ],
      });
    }

    // Verify getBladeDocsResponseText was called with correct parameters
    expect(getBladeDocsResponseText.getBladeDocsResponseText).toHaveBeenCalledWith({
      docsList: mockComponentsList,
      documentationType: 'components',
      framework: 'react',
    });
  });

  it('should pass framework="svelte" through to getBladeDocsResponseText', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockComponentsList = 'Button';
    const mockResponseText = 'Mock svelte component documentation';

    vi.spyOn(generalUtils, 'getBladeDocsList').mockReturnValue(['Button']);
    vi.spyOn(getBladeDocsResponseText, 'getBladeDocsResponseText').mockReturnValue(
      mockResponseText,
    );

    const httpCallback = getBladeComponentDocsHttpCallback;

    const result = httpCallback(
      {
        componentsList: mockComponentsList,
        framework: 'svelte',
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    expect(getBladeDocsResponseText.getBladeDocsResponseText).toHaveBeenCalledWith({
      docsList: mockComponentsList,
      documentationType: 'components',
      framework: 'svelte',
    });

    expect(analyticsUtils.sendAnalytics).toHaveBeenCalledWith({
      eventName: expect.any(String),
      properties: expect.objectContaining({
        framework: 'svelte',
      }),
    });

    expect(result).toHaveProperty('content');
  });

  it('should auto-detect framework when omitted', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/svelte-project';
    const mockComponentsList = 'Button';
    const mockResponseText = 'Mock svelte component documentation';

    vi.spyOn(generalUtils, 'getBladeDocsList').mockReturnValue(['Button']);
    vi.spyOn(detectFramework, 'detectFrameworkFromProject').mockReturnValue('svelte');
    vi.spyOn(getBladeDocsResponseText, 'getBladeDocsResponseText').mockReturnValue(
      mockResponseText,
    );

    const result = getBladeComponentDocsHttpCallback(
      {
        componentsList: mockComponentsList,
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
      docsList: mockComponentsList,
      documentationType: 'components',
      framework: 'svelte',
    });
    expect(analyticsUtils.sendAnalytics).toHaveBeenCalledWith({
      eventName: expect.any(String),
      properties: expect.objectContaining({
        framework: 'svelte',
      }),
    });
    expect(result).toHaveProperty('content');
  });

  it('should prefer explicit framework over auto-detect', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/svelte-project';
    const mockComponentsList = 'Button';
    const mockResponseText = 'Mock react component documentation';

    vi.spyOn(generalUtils, 'getBladeDocsList').mockReturnValue(['Button']);
    vi.spyOn(detectFramework, 'detectFrameworkFromProject').mockReturnValue('svelte');
    vi.spyOn(getBladeDocsResponseText, 'getBladeDocsResponseText').mockReturnValue(
      mockResponseText,
    );

    getBladeComponentDocsHttpCallback(
      {
        componentsList: mockComponentsList,
        framework: 'react',
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    expect(detectFramework.detectFrameworkFromProject).not.toHaveBeenCalled();
    expect(getBladeDocsResponseText.getBladeDocsResponseText).toHaveBeenCalledWith({
      docsList: mockComponentsList,
      documentationType: 'components',
      framework: 'react',
    });
  });

  it('should reject invalid framework values', () => {
    const parseResult = getBladeComponentDocsHttpSchema.framework.safeParse('vue');

    expect(parseResult.success).toBe(false);
  });

  it('should return error for invalid components', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockComponentsList = 'InvalidComponent, AnotherInvalid';

    // Get the HTTP callback
    const httpCallback = getBladeComponentDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        componentsList: mockComponentsList,
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

    // Verify analytics was not called for invalid components
    expect(analyticsUtils.sendAnalytics).not.toHaveBeenCalled();
  });

  it('should return consistent component docs response (snapshot)', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testComponentsList = 'Button, Accordion';

    // Get the actual implementations (not mocked) to test real output
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
    const httpCallback = getBladeComponentDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        componentsList: testComponentsList,
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

  it('should return consistent component docs response for claude agent (snapshot)', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testComponentsList = 'Button, Accordion';

    // Get the actual implementations (not mocked) to test real output
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
    const httpCallback = getBladeComponentDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        componentsList: testComponentsList,
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

  it('should return consistent component docs response for stdio transport', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testComponentsList = 'Button, Accordion';

    // Get the actual implementations (not mocked) to test real output
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

    // Get the stdio callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stdioCallback = getBladeComponentDocsStdioCallback;

    // Call the tool callback with actual implementation
    const result = stdioCallback(
      {
        componentsList: testComponentsList,
        framework: 'react',
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'cursor',
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });
});
