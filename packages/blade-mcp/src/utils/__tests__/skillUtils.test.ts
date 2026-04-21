import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { describe, it, expect, afterEach } from 'vitest';
import {
  isSkillFileMissing,
  isSkillOutdated,
  shouldCreateOrUpdateSkill,
  skillCreationInstructions,
} from '../skillUtils.js';
import { SKILL_VERSION, BLADE_SKILL_FILE_PATH, SKILL_VERSION_STRING } from '../tokens.js';

describe('skillUtils', () => {
  describe('shouldCreateOrUpdateSkill (file-system path, skipLocalSkillChecks = false)', () => {
    let tmpDir: string;

    afterEach(() => {
      if (tmpDir && fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true });
      }
    });

    const makeSkillFile = (dir: string, content: string): void => {
      const skillDir = path.join(dir, '.agents/skills/ui-code-guidelines');
      fs.mkdirSync(skillDir, { recursive: true });
      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content);
    };

    it('should return undefined when skill file exists and is up to date', () => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blade-skill-test-'));
      makeSkillFile(tmpDir, `metadata:\n  ${SKILL_VERSION_STRING}`);

      const result = shouldCreateOrUpdateSkill('0', tmpDir, false, 'get_blade_component_docs');

      expect(result).toBeUndefined();
    });

    it('should return outdated error when skill file exists but version string does not match', () => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blade-skill-test-'));
      makeSkillFile(tmpDir, 'version: "0.0.1"');

      const result = shouldCreateOrUpdateSkill('0', tmpDir, false, 'get_blade_component_docs');

      expect(result).toMatchObject({
        isError: true,
        content: [{ type: 'text', text: expect.stringContaining('Blade skill is outdated') }],
      });
    });

    it('should return missing error when skill file does not exist', () => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blade-skill-test-'));

      const result = shouldCreateOrUpdateSkill('0', tmpDir, false, 'get_blade_component_docs');

      expect(result).toMatchObject({
        isError: true,
        content: [{ type: 'text', text: expect.stringContaining('Blade skill does not exist') }],
      });
    });

    it('should return undefined when skill file contains the actual SKILL.md template content (regression: quote mismatch)', () => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blade-skill-test-'));
      // Simulate what createBladeSkill writes — the real template content
      makeSkillFile(tmpDir, fs.readFileSync(BLADE_SKILL_FILE_PATH, 'utf8'));

      const result = shouldCreateOrUpdateSkill('0', tmpDir, false, 'get_blade_component_docs');

      expect(result).toBeUndefined();
    });
  });

  describe('isSkillFileMissing', () => {
    it('should return true when skill version is "0"', () => {
      expect(isSkillFileMissing('0')).toBe(true);
    });

    it('should return false when skill version is not "0"', () => {
      expect(isSkillFileMissing('0.0.8')).toBe(false);
      expect(isSkillFileMissing('1.0.0')).toBe(false);
    });
  });

  describe('isSkillOutdated', () => {
    it('should return true when skill version does not match latest version', () => {
      expect(isSkillOutdated('0.0.7')).toBe(true);
      expect(isSkillOutdated('0.0.1')).toBe(true);
      expect(isSkillOutdated('99.99.99')).toBe(true);
    });

    it('should return false when skill version matches latest version', () => {
      expect(isSkillOutdated(SKILL_VERSION)).toBe(false);
    });
  });

  describe('skillCreationInstructions', () => {
    it('should return consistent instructions for skill creation (snapshot)', () => {
      const result = skillCreationInstructions({
        currentProjectRootDirectory: '/Users/test/project',
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('shouldCreateOrUpdateSkill (version-based, skipLocalSkillChecks = true)', () => {
    const mockProjectRootDirectory = '/Users/test/project';

    it('should return content with creation instructions when skill is missing', () => {
      const result = shouldCreateOrUpdateSkill('0', mockProjectRootDirectory, true);

      expect(result).toMatchObject({
        content: [{ type: 'text', text: expect.stringContaining('Blade skill does not exist') }],
      });
      expect(result!.content[0].text).toContain(mockProjectRootDirectory);
    });

    it('should return content with update instructions when skill is outdated', () => {
      const outdatedVersion = '0.0.1';
      const result = shouldCreateOrUpdateSkill(outdatedVersion, mockProjectRootDirectory, true);

      expect(result).toMatchObject({
        content: [{ type: 'text', text: expect.stringContaining('Blade skill is outdated') }],
      });
      const text = result!.content[0].text;
      expect(text).toContain(outdatedVersion);
      expect(text).toContain(SKILL_VERSION);
      expect(text).toContain(mockProjectRootDirectory);
    });

    it('should return undefined when skill version matches SKILL_VERSION', () => {
      expect(
        shouldCreateOrUpdateSkill(SKILL_VERSION, mockProjectRootDirectory, true),
      ).toBeUndefined();
    });

    it('should return outdated error when version is "0.0.0"', () => {
      const result = shouldCreateOrUpdateSkill('0.0.0', mockProjectRootDirectory, true);

      expect(result).toMatchObject({
        content: [{ type: 'text', text: expect.stringContaining('Blade skill is outdated') }],
      });
      const text = result!.content[0].text;
      expect(text).toContain('0.0.0');
      expect(text).toContain(SKILL_VERSION);
    });
  });
});
