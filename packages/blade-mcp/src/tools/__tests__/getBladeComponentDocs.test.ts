import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBladeComponentDocsToolCallback } from '../getBladeComponentDocs.js';
import * as analyticsUtils from '../../utils/analyticsUtils.js';
import * as cursorRulesUtils from '../../utils/cursorRulesUtils.js';
import * as getBladeDocsResponseText from '../../utils/getBladeDocsResponseText.js';
import * as generalUtils from '../../utils/generalUtils.js';
import { CURSOR_RULES_VERSION } from '../../utils/tokens.js';

// Mock the analytics and utility functions
vi.mock('../../utils/analyticsUtils.js', async () => {
  const actual = await vi.importActual<typeof analyticsUtils>('../../utils/analyticsUtils.js');
  return {
    ...actual,
    sendAnalytics: vi.fn(),
  };
});
vi.mock('../../utils/cursorRulesUtils.js');
vi.mock('../../utils/getBladeDocsResponseText.js');
vi.mock('../../utils/generalUtils.js', () => ({
  getBladeDocsList: vi.fn(() => ['Button', 'Accordion', 'Input']),
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
    vi.spyOn(cursorRulesUtils, 'isCursorRuleFileMissing').mockReturnValue(false);
    vi.spyOn(cursorRulesUtils, 'areCursorRulesOutdated').mockReturnValue(false);
  });

  it('should return component docs for valid components', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockComponentsList = 'Button, Accordion';
    const mockResponseText = 'Mock component documentation';

    // Mock the getBladeDocsResponseText function
    vi.spyOn(getBladeDocsResponseText, 'getBladeDocsResponseText').mockReturnValue(
      mockResponseText,
    );

    // Call the tool callback
    const result = getBladeComponentDocsToolCallback(
      {
        componentsList: mockComponentsList,
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        cursorRuleVersion: CURSOR_RULES_VERSION,
      },
      createMockContext(),
    );

    // Verify analytics was called
    expect(analyticsUtils.sendAnalytics).toHaveBeenCalledWith({
      eventName: expect.any(String),
      properties: {
        toolName: 'get_blade_component_docs',
        componentsList: mockComponentsList,
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
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
      docsList: mockComponentsList,
      documentationType: 'components',
    });
  });

  it('should return error for invalid components', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockComponentsList = 'InvalidComponent, AnotherInvalid';

    // Call the tool callback
    const result = getBladeComponentDocsToolCallback(
      {
        componentsList: mockComponentsList,
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        cursorRuleVersion: CURSOR_RULES_VERSION,
      },
      createMockContext(),
    );

    // Verify the result is an error
    expect(result).toBeDefined();
    expect(result).toHaveProperty('isError', true);
    if (result && 'isError' in result && result.isError) {
      expect(result.content).toBeDefined();
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty('type', 'text');
    }

    // Verify analytics was not called for invalid components
    expect(analyticsUtils.sendAnalytics).not.toHaveBeenCalled();
  });

  it('should return cursor rule creation instructions when cursor rules are missing', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockComponentsList = 'Button';
    const mockInstructions = 'Mock instructions for creating cursor rules';

    // Mock cursor rules as missing
    vi.spyOn(cursorRulesUtils, 'isCursorRuleFileMissing').mockReturnValue(true);
    vi.spyOn(cursorRulesUtils, 'cursorRuleCreationInstructions').mockReturnValue(mockInstructions);

    // Call the tool callback
    const result = getBladeComponentDocsToolCallback(
      {
        componentsList: mockComponentsList,
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        cursorRuleVersion: '0',
      },
      createMockContext(),
    );

    // Verify the result contains cursor rule creation instructions
    expect(result).toHaveProperty('content');
    if ('content' in result && !('isError' in result)) {
      expect(result.content[0]).toHaveProperty('type', 'text');
      if ('text' in result.content[0]) {
        expect(result.content[0].text).toContain(mockInstructions);
      }
    }

    // Verify cursorRuleCreationInstructions was called
    expect(cursorRulesUtils.cursorRuleCreationInstructions).toHaveBeenCalledWith(
      mockCurrentProjectRootDirectory,
    );

    // Verify analytics was not called when cursor rules are missing
    expect(analyticsUtils.sendAnalytics).not.toHaveBeenCalled();
  });

  it('should return cursor rule update instructions when cursor rules are outdated', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockComponentsList = 'Button';
    const mockInstructions = 'Mock instructions for updating cursor rules';
    const outdatedVersion = '1.0.0';

    // Mock cursor rules as outdated
    vi.spyOn(cursorRulesUtils, 'areCursorRulesOutdated').mockReturnValue(true);
    vi.spyOn(cursorRulesUtils, 'cursorRuleCreationInstructions').mockReturnValue(mockInstructions);

    // Call the tool callback
    const result = getBladeComponentDocsToolCallback(
      {
        componentsList: mockComponentsList,
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        cursorRuleVersion: outdatedVersion,
      },
      createMockContext(),
    );

    // Verify the result contains cursor rule update instructions
    expect(result).toHaveProperty('content');
    if ('content' in result && !('isError' in result)) {
      expect(result.content[0]).toHaveProperty('type', 'text');
      if ('text' in result.content[0]) {
        expect(result.content[0].text).toContain(mockInstructions);
        expect(result.content[0].text).toContain(outdatedVersion);
        expect(result.content[0].text).toContain(CURSOR_RULES_VERSION);
      }
    }

    // Verify cursorRuleCreationInstructions was called
    expect(cursorRulesUtils.cursorRuleCreationInstructions).toHaveBeenCalledWith(
      mockCurrentProjectRootDirectory,
    );

    // Verify analytics was not called when cursor rules are outdated
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

    // Mock cursor rules as not missing and not outdated
    vi.spyOn(cursorRulesUtils, 'isCursorRuleFileMissing').mockReturnValue(false);
    vi.spyOn(cursorRulesUtils, 'areCursorRulesOutdated').mockReturnValue(false);

    // Call the tool callback with actual implementation
    const result = getBladeComponentDocsToolCallback(
      {
        componentsList: testComponentsList,
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'cursor',
        cursorRuleVersion: CURSOR_RULES_VERSION,
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });
});
