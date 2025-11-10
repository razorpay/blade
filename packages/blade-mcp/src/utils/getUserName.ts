/**
 * Extracts the username from a file system path using regex pattern matching.
 *
 * This function uses a regex pattern to identify the username from common path structures:
 * - **macOS**: `/Users/username/...`
 * - **Linux**: `/home/username/...`
 * - **Windows**: `C:\Users\username\...` (normalized to forward slashes)
 *
 * The function excludes common directory names (Desktop, Documents, Downloads, Projects, workspace)
 * that might appear after the home directory to avoid false positives.
 *
 * @param params - Configuration object
 * @param params.currentProjectRootDirectory - The absolute path to the project root directory
 * @returns The extracted username, or 'unknown' if unable to determine from the path structure
 *
 * @example
 * ```ts
 * // macOS path
 * getUserName({ currentProjectRootDirectory: '/Users/john/Desktop/my-project' });
 * // Returns: 'john'
 * ```
 *
 * @example
 * ```ts
 * // Linux path
 * getUserName({ currentProjectRootDirectory: '/home/jane/projects/app' });
 * // Returns: 'jane'
 * ```
 *
 * @example
 * ```ts
 * // Windows path (normalized)
 * getUserName({ currentProjectRootDirectory: 'C:/Users/bob/Documents/work' });
 * // Returns: 'bob'
 * ```
 *
 * @example
 * ```ts
 * // Edge case: path without standard structure
 * getUserName({ currentProjectRootDirectory: '/some/custom/path' });
 * // Returns: 'some' (first meaningful segment) or 'unknown'
 * ```
 */
const getUserName = ({
  currentProjectRootDirectory,
}: {
  currentProjectRootDirectory: string;
}): string => {
  // Match /Users/username or /home/username patterns, excluding common directories
  const match = currentProjectRootDirectory.match(/\/(?:Users|home)\/([^/]+)(?:\/|$)/);
  const username = match?.[1];
  const excludedDirs = ['Desktop', 'Documents', 'Downloads', 'Projects', 'workspace'];

  if (username && !excludedDirs.includes(username)) {
    return username;
  }

  // Fallback: return first non-empty path segment
  return currentProjectRootDirectory.split('/').find((part) => part) ?? 'unknown';
};

export { getUserName };
