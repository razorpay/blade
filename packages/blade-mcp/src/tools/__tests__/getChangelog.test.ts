import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as analyticsUtils from '../../utils/analyticsUtils.js';
import { getChangelogToolCallback, getChangelogToolSchema } from '../getChangelog.js';

vi.mock('../../utils/analyticsUtils.js', async () => {
  const actual = await vi.importActual<typeof analyticsUtils>('../../utils/analyticsUtils.js');
  return {
    ...actual,
    sendAnalytics: vi.fn(),
  };
});

const changelog = `# @razorpay/blade

## 12.2.0

### Minor Changes

- Added a new component

## 12.1.0

### Patch Changes

- Fixed component behavior

## 12.0.0

### Patch Changes

- Updated component styles
`;

const fetchMock = vi.fn();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockContext = (): any => ({
  signal: new AbortController().signal,
  requestId: 'test-request-id',
  sendNotification: vi.fn().mockResolvedValue(undefined),
  sendRequest: vi.fn().mockResolvedValue({}),
});

const getResponseText = (result: Awaited<ReturnType<typeof getChangelogToolCallback>>): string => {
  const content = result.content[0];
  return content.type === 'text' ? content.text : '';
};

describe('get_blade_changelog tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue(changelog),
    });
  });

  it('accepts only latest or a complete semantic version', () => {
    expect(getChangelogToolSchema.fromVersion.safeParse('latest').success).toBe(true);
    expect(getChangelogToolSchema.fromVersion.safeParse('12.10.0').success).toBe(true);
    expect(getChangelogToolSchema.fromVersion.safeParse('v12.10').success).toBe(false);
  });

  it('returns a single requested release', async () => {
    const result = await getChangelogToolCallback(
      {
        fromVersion: '12.1.0',
        toVersion: undefined,
        isRange: undefined,
        currentProjectRootDirectory: '/Users/test/project',
      },
      createMockContext(),
    );

    expect(result).not.toHaveProperty('isError');
    expect(getResponseText(result)).toContain('Changelog for: version 12.1.0');
    expect(getResponseText(result)).toContain('Fixed component behavior');
    expect(getResponseText(result)).not.toContain('Added a new component');
    expect(analyticsUtils.sendAnalytics).toHaveBeenCalledWith({
      eventName: expect.any(String),
      properties: {
        toolName: 'get_blade_changelog',
        fromVersion: '12.1.0',
        toVersion: undefined,
        currentProjectRootDirectory: '/Users/test/project',
      },
    });
  });

  it('resolves latest and returns an inclusive range', async () => {
    const result = await getChangelogToolCallback(
      {
        fromVersion: '12.1.0',
        toVersion: 'latest',
        isRange: true,
        currentProjectRootDirectory: '/Users/test/project',
      },
      createMockContext(),
    );

    expect(result).not.toHaveProperty('isError');
    expect(getResponseText(result)).toContain('range from 12.1.0 to 12.2.0');
    expect(getResponseText(result)).toContain('Added a new component');
    expect(getResponseText(result)).toContain('Fixed component behavior');
    expect(getResponseText(result)).not.toContain('Updated component styles');
  });

  it('rejects a range hint without an end version before fetching', async () => {
    const result = await getChangelogToolCallback(
      {
        fromVersion: '12.1.0',
        toVersion: undefined,
        isRange: true,
        currentProjectRootDirectory: '/Users/test/project',
      },
      createMockContext(),
    );

    expect(result).toHaveProperty('isError', true);
    expect(getResponseText(result)).toContain('`toVersion` is required');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(analyticsUtils.sendAnalytics).not.toHaveBeenCalled();
  });

  it('returns a useful error when a release is unavailable', async () => {
    const result = await getChangelogToolCallback(
      {
        fromVersion: '11.0.0',
        toVersion: undefined,
        isRange: undefined,
        currentProjectRootDirectory: '/Users/test/project',
      },
      createMockContext(),
    );

    expect(result).toHaveProperty('isError', true);
    expect(getResponseText(result)).toContain('No Blade changelog entry was found for 11.0.0');
    expect(getResponseText(result)).toContain('latest available version is 12.2.0');
    expect(getResponseText(result)).not.toContain('undefined');
    expect(analyticsUtils.sendAnalytics).not.toHaveBeenCalled();
  });

  it('rejects reversed ranges', async () => {
    const result = await getChangelogToolCallback(
      {
        fromVersion: '12.2.0',
        toVersion: '12.0.0',
        isRange: undefined,
        currentProjectRootDirectory: '/Users/test/project',
      },
      createMockContext(),
    );

    expect(result).toHaveProperty('isError', true);
    expect(getResponseText(result)).toContain(
      'fromVersion (12.2.0) must be less than or equal to toVersion (12.0.0)',
    );
    expect(analyticsUtils.sendAnalytics).not.toHaveBeenCalled();
  });

  it('reports upstream HTTP failures without parsing the response', async () => {
    const responseText = vi.fn();
    fetchMock.mockResolvedValue({ ok: false, status: 503, text: responseText });

    const result = await getChangelogToolCallback(
      {
        fromVersion: '12.1.0',
        toVersion: undefined,
        isRange: undefined,
        currentProjectRootDirectory: '/Users/test/project',
      },
      createMockContext(),
    );

    expect(result).toHaveProperty('isError', true);
    expect(getResponseText(result)).toContain('HTTP 503');
    expect(responseText).not.toHaveBeenCalled();
    expect(analyticsUtils.sendAnalytics).not.toHaveBeenCalled();
  });

  it('reports malformed changelog responses', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue('# @razorpay/blade\n\nNo releases yet'),
    });

    const result = await getChangelogToolCallback(
      {
        fromVersion: 'latest',
        toVersion: undefined,
        isRange: undefined,
        currentProjectRootDirectory: '/Users/test/project',
      },
      createMockContext(),
    );

    expect(result).toHaveProperty('isError', true);
    expect(getResponseText(result)).toContain('did not contain any release entries');
    expect(analyticsUtils.sendAnalytics).not.toHaveBeenCalled();
  });
});
