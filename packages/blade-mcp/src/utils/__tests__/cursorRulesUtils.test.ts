import { describe, it, expect } from 'vitest';
import {
  isCursorRuleFileMissing,
  areCursorRulesOutdated,
  cursorRuleCreationInstructions,
} from '../cursorRulesUtils.js';
import { CURSOR_RULES_VERSION } from '../tokens.js';

describe('cursorRulesUtils', () => {
  describe('isCursorRuleFileMissing', () => {
    it('should return true when cursor rule version is "0" and client is "cursor"', () => {
      expect(isCursorRuleFileMissing('0', 'cursor')).toBe(true);
    });

    it('should return false when cursor rule version is not "0" and client is "cursor"', () => {
      expect(isCursorRuleFileMissing('0.0.8', 'cursor')).toBe(false);
    });

    it('should return false when cursor rule version is "0" but client is not "cursor"', () => {
      expect(isCursorRuleFileMissing('0', 'claude')).toBe(false);
      expect(isCursorRuleFileMissing('0', 'unknown')).toBe(false);
    });

    it('should return false when cursor rule version is not "0" and client is not "cursor"', () => {
      expect(isCursorRuleFileMissing('0.0.8', 'claude')).toBe(false);
      expect(isCursorRuleFileMissing('0.0.8', 'unknown')).toBe(false);
    });
  });

  describe('areCursorRulesOutdated', () => {
    it('should return true when cursor rule version does not match latest version and client is "cursor"', () => {
      expect(areCursorRulesOutdated('0.0.7', 'cursor')).toBe(true);
      expect(areCursorRulesOutdated('0.0.1', 'cursor')).toBe(true);
      expect(areCursorRulesOutdated('1.0.0', 'cursor')).toBe(true);
    });

    it('should return false when cursor rule version matches latest version and client is "cursor"', () => {
      expect(areCursorRulesOutdated(CURSOR_RULES_VERSION, 'cursor')).toBe(false);
    });

    it('should return false when cursor rule version does not match but client is not "cursor"', () => {
      expect(areCursorRulesOutdated('0.0.7', 'claude')).toBe(false);
      expect(areCursorRulesOutdated('0.0.7', 'unknown')).toBe(false);
    });

    it('should return false when cursor rule version matches and client is not "cursor"', () => {
      expect(areCursorRulesOutdated(CURSOR_RULES_VERSION, 'claude')).toBe(false);
      expect(areCursorRulesOutdated(CURSOR_RULES_VERSION, 'unknown')).toBe(false);
    });
  });

  describe('cursorRuleCreationInstructions', () => {
    it('should return consistent instructions for cursor rule creation (snapshot)', () => {
      const testProjectRootDirectory = '/Users/test/project';
      const result = cursorRuleCreationInstructions(testProjectRootDirectory);
      expect(result).toMatchSnapshot();
    });

    it('should return consistent instructions with different project paths (snapshot)', () => {
      const testProjectRootDirectory = '/home/user/workspace/my-app';
      const result = cursorRuleCreationInstructions(testProjectRootDirectory);
      expect(result).toMatchSnapshot();
    });

    it('should return consistent instructions with Windows-style path (snapshot)', () => {
      const testProjectRootDirectory = 'C:/Users/john/Documents/project';
      const result = cursorRuleCreationInstructions(testProjectRootDirectory);
      expect(result).toMatchSnapshot();
    });

    it('should return consistent instructions with nested path (snapshot)', () => {
      const testProjectRootDirectory = '/Users/alice/Desktop/blade-12/blade';
      const result = cursorRuleCreationInstructions(testProjectRootDirectory);
      expect(result).toMatchSnapshot();
    });
  });
});
