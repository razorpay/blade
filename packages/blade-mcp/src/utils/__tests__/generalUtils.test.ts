import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { describe, it, expect, afterEach } from 'vitest';
import { hasOutdatedSkill } from '../generalUtils.js';
import { BLADE_SKILL_FILE_PATH, SKILL_VERSION_STRING } from '../tokens.js';

describe('hasOutdatedSkill', () => {
  let tmpFile: string;

  afterEach(() => {
    if (tmpFile && fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  });

  it('should return false for the actual SKILL.md template (regression: quote mismatch)', () => {
    expect(hasOutdatedSkill(BLADE_SKILL_FILE_PATH)).toBe(false);
  });

  it('should return true when skill file does not contain the current version string', () => {
    tmpFile = path.join(os.tmpdir(), 'test-outdated-SKILL.md');
    fs.writeFileSync(tmpFile, 'version: "0.0.1"');
    expect(hasOutdatedSkill(tmpFile)).toBe(true);
  });

  it('should return false when skill file contains the exact version string', () => {
    tmpFile = path.join(os.tmpdir(), 'test-current-SKILL.md');
    fs.writeFileSync(tmpFile, `metadata:\n  ${SKILL_VERSION_STRING}`);
    expect(hasOutdatedSkill(tmpFile)).toBe(false);
  });
});
