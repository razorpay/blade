import { describe, it, expect } from 'vitest';
import { getUserName } from '../getUserName.js';

describe('getUserName', () => {
  describe('macOS paths', () => {
    it('should extract username from macOS path with Desktop', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/john/Desktop/my-project',
      });
      expect(result).toBe('john');
    });

    it('should extract username from macOS path with Documents', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/jane/Documents/work',
      });
      expect(result).toBe('jane');
    });

    it('should extract username from macOS path with Downloads', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/bob/Downloads/files',
      });
      expect(result).toBe('bob');
    });
  });

  describe('Linux paths', () => {
    it('should extract username from Linux path with custom directory', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/home/john/projects/app',
      });
      expect(result).toBe('john');
    });

    it('should extract username from Linux path with Desktop', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/home/jane/Desktop/my-project',
      });
      expect(result).toBe('jane');
    });

    it('should extract username from Linux path ending with username', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/home/bob',
      });
      expect(result).toBe('bob');
    });
  });

  describe('Windows paths (normalized)', () => {
    it('should extract username from Windows path with forward slashes', () => {
      const result = getUserName({
        currentProjectRootDirectory: 'C:/Users/john/Documents/work',
      });
      expect(result).toBe('john');
    });

    it('should extract username from Windows path with Desktop', () => {
      const result = getUserName({
        currentProjectRootDirectory: 'C:/Users/jane/Desktop/project',
      });
      expect(result).toBe('jane');
    });

    it('should extract username from Windows path ending with username', () => {
      const result = getUserName({
        currentProjectRootDirectory: 'C:/Users/bob',
      });
      expect(result).toBe('bob');
    });
  });

  describe('edge cases', () => {
    it('should return first meaningful segment for path without standard structure', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/some/custom/path',
      });
      expect(result).toBe('some');
    });

    it('should return first meaningful segment for root path', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/',
      });
      expect(result).toBe('unknown');
    });

    it('should return first meaningful segment for empty path', () => {
      const result = getUserName({
        currentProjectRootDirectory: '',
      });
      expect(result).toBe('unknown');
    });

    it('should handle path with Documents as username (should fallback)', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/Documents/project',
      });
      // Documents is excluded, so it should fallback
      expect(result).toBe('Users');
    });

    it('should handle path with Downloads as username (should fallback)', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/Downloads/project',
      });
      // Downloads is excluded, so it should fallback
      expect(result).toBe('Users');
    });
  });
});
