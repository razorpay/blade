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

    it('should extract username from macOS path with Projects', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/alice/Projects/app',
      });
      expect(result).toBe('alice');
    });

    it('should extract username from macOS path with workspace', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/charlie/workspace/project',
      });
      expect(result).toBe('charlie');
    });

    it('should extract username from macOS path with custom directory', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/david/custom/project',
      });
      expect(result).toBe('david');
    });

    it('should extract username from macOS path ending with username', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/emma',
      });
      expect(result).toBe('emma');
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

    it('should handle path with only slashes', () => {
      const result = getUserName({
        currentProjectRootDirectory: '///',
      });
      expect(result).toBe('unknown');
    });

    it('should handle path starting with multiple slashes', () => {
      const result = getUserName({
        currentProjectRootDirectory: '///Users/john/project',
      });
      expect(result).toBe('john');
    });

    it('should handle path with excluded directory as username (should fallback)', () => {
      // If Desktop is the username, it should be excluded and fallback to first segment
      const result = getUserName({
        currentProjectRootDirectory: '/Users/Desktop/project',
      });
      // Desktop is excluded, so it should fallback to first meaningful segment
      expect(result).toBe('Users');
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

    it('should handle path with Projects as username (should fallback)', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/Projects/project',
      });
      // Projects is excluded, so it should fallback
      expect(result).toBe('Users');
    });

    it('should handle path with workspace as username (should fallback)', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/workspace/project',
      });
      // workspace is excluded, so it should fallback
      expect(result).toBe('Users');
    });

    it('should handle path with multiple excluded directories', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/Desktop/Documents/project',
      });
      // Desktop is excluded, so it should fallback
      expect(result).toBe('Users');
    });

    it('should handle path with username containing special characters', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/john.doe/project',
      });
      expect(result).toBe('john.doe');
    });

    it('should handle path with username containing numbers', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/user123/project',
      });
      expect(result).toBe('user123');
    });

    it('should handle path with username containing hyphens', () => {
      const result = getUserName({
        currentProjectRootDirectory: '/Users/john-doe/project',
      });
      expect(result).toBe('john-doe');
    });
  });
});
