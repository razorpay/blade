import { describe, expect, it } from 'vitest';
import {
  compareVersions,
  getLatestVersion,
  getRangeChangelogs,
  parseChangelog,
  stringifyChangelog,
} from '../changelogParser.js';

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

describe('changelogParser', () => {
  it('parses release entries and their descriptions', () => {
    expect(parseChangelog(changelog)).toEqual({
      '12.2.0': '### Minor Changes\n\n- Added a new component',
      '12.1.0': '### Patch Changes\n\n- Fixed component behavior',
      '12.0.0': '### Patch Changes\n\n- Updated component styles',
    });
  });

  it('compares semantic versions numerically', () => {
    expect(compareVersions('12.10.0', '12.9.9')).toBe(1);
    expect(compareVersions('12.1.0', '12.1.0')).toBe(0);
    expect(compareVersions('11.99.0', '12.0.0')).toBe(-1);
  });

  it('finds the highest semantic version regardless of changelog order', () => {
    const unorderedChangelog = `## 12.1.0\n\nFirst\n\n## 12.10.0\n\nLatest`;

    expect(getLatestVersion(unorderedChangelog)).toEqual({
      version: '12.10.0',
      description: 'Latest',
    });
  });

  it('returns one requested release when no end version is provided', () => {
    expect(getRangeChangelogs(changelog, '12.1.0')).toEqual({
      '12.1.0': '### Patch Changes\n\n- Fixed component behavior',
    });
  });

  it('returns an inclusive range of releases', () => {
    expect(getRangeChangelogs(changelog, '12.0.0', '12.1.0')).toEqual({
      '12.1.0': '### Patch Changes\n\n- Fixed component behavior',
      '12.0.0': '### Patch Changes\n\n- Updated component styles',
    });
  });

  it('rejects missing and reversed range boundaries', () => {
    expect(getRangeChangelogs(changelog, '11.0.0')).toBeUndefined();
    expect(getRangeChangelogs(changelog, '12.0.0', '12.3.0')).toBeUndefined();
    expect(getRangeChangelogs(changelog, '12.2.0', '12.0.0')).toBeUndefined();
  });

  it('stringifies parsed entries without undefined descriptions', () => {
    const parsed = getRangeChangelogs(changelog, '12.1.0');

    expect(parsed).toBeDefined();
    expect(stringifyChangelog(parsed ?? {})).toBe(
      '\n## 12.1.0\n### Patch Changes\n\n- Fixed component behavior',
    );
  });
});
