import { describe, it, expect } from 'vitest';
import {
  isSkillFileMissing,
  isSkillOutdated,
  shouldCreateOrUpdateSkill,
  skillCreationInstructions,
} from '../skillUtils.js';
import { SKILL_VERSION } from '../tokens.js';

describe('skillUtils', () => {
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
      expect(isSkillOutdated('1.0.0')).toBe(true);
    });

    it('should return false when skill version matches latest version', () => {
      expect(isSkillOutdated(SKILL_VERSION)).toBe(false);
    });
  });

  describe('skillCreationInstructions', () => {
    it('should return consistent instructions for skill creation (snapshot)', () => {
      const testProjectRootDirectory = '/Users/test/project';
      const result = skillCreationInstructions({
        currentProjectRootDirectory: testProjectRootDirectory,
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('shouldCreateOrUpdateSkill', () => {
    const mockProjectRootDirectory = '/Users/test/project';

    it('should return content with creation instructions when skill is missing', () => {
      const result = shouldCreateOrUpdateSkill(
        '0',
        mockProjectRootDirectory,
        true, // skipLocalSkillChecks = true to test version-based checks only
      );

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        content: [
          {
            type: 'text',
            text: expect.stringContaining('Blade skill does not exist'),
          },
        ],
      });
      if (result) {
        expect(result.content[0].text).toContain(mockProjectRootDirectory);
      }
    });

    it('should return content with update instructions when skill is outdated', () => {
      const outdatedVersion = '1.0.0';
      const result = shouldCreateOrUpdateSkill(
        outdatedVersion,
        mockProjectRootDirectory,
        true, // skipLocalSkillChecks = true to test version-based checks only
      );

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        content: [
          {
            type: 'text',
            text: expect.stringContaining('Blade skill is outdated'),
          },
        ],
      });
      if (result) {
        const text = result.content[0].text;
        expect(text).toContain(outdatedVersion);
        expect(text).toContain(SKILL_VERSION);
        expect(text).toContain(mockProjectRootDirectory);
      }
    });

    it('should return undefined when skill is up to date', () => {
      const result = shouldCreateOrUpdateSkill(
        SKILL_VERSION,
        mockProjectRootDirectory,
        true, // skipLocalSkillChecks = true to test version-based checks only
      );

      expect(result).toBeUndefined();
    });

    describe('with skipLocalSkillChecks = true', () => {
      it('should return undefined when version matches SKILL_VERSION', () => {
        const result = shouldCreateOrUpdateSkill(
          '0.0.8',
          mockProjectRootDirectory,
          true, // skipLocalSkillChecks = true
        );

        expect(result).toBeUndefined();
      });

      it('should return content with update instructions when version is outdated', () => {
        const result = shouldCreateOrUpdateSkill(
          '0.0.0',
          mockProjectRootDirectory,
          true, // skipLocalSkillChecks = true
        );

        expect(result).toBeDefined();
        expect(result).toMatchObject({
          content: [
            {
              type: 'text',
              text: expect.stringContaining('Blade skill is outdated'),
            },
          ],
        });
        if (result) {
          const text = result.content[0].text;
          expect(text).toContain('0.0.0');
          expect(text).toContain(SKILL_VERSION);
          expect(text).toContain(mockProjectRootDirectory);
        }
      });
    });
  });
});
