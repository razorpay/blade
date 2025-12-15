/**
 * Parses a changelog string and returns an object with version numbers as keys
 * and their descriptions as values
 */

type ParsedChangelog = {
  [version: string]: string;
};

/**
 * Parses a changelog string in the format provided
 * @param changelogContent - The raw changelog content as a string
 * @returns Object with version numbers as keys and descriptions as values
 */
function parseChangelog(changelogContent: string): ParsedChangelog {
  const result: ParsedChangelog = {};

  // Split the content into lines for processing
  const lines = changelogContent.split('\n');

  let currentVersion = '';
  let currentDescription = '';
  let isCollectingDescription = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if this is a version header (starts with ##)
    const versionMatch = line.match(/^##\s+(\d+\.\d+\.\d+)$/);

    if (versionMatch) {
      // Save the previous version if we have one
      if (currentVersion && currentDescription.trim()) {
        result[currentVersion] = currentDescription.trim();
      }

      // Start collecting new version
      currentVersion = versionMatch[1];
      currentDescription = '';
      isCollectingDescription = true;
      continue;
    }

    // If we're collecting description for a version
    if (isCollectingDescription && currentVersion) {
      // Stop collecting if we hit the package title or another major section
      if (line.startsWith('# @') || line.startsWith('# ')) {
        continue;
      }

      // Add non-empty lines to description
      if (line || currentDescription) {
        currentDescription += `${line}\n`;
      }
    }
  }

  // Don't forget the last version
  if (currentVersion && currentDescription.trim()) {
    result[currentVersion] = currentDescription.trim();
  }

  return result;
}

/**
 * Compares two semantic versions
 * @param version1 - First version string (e.g., "12.0.0")
 * @param version2 - Second version string (e.g., "12.15.0")
 * @returns -1 if version1 < version2, 1 if version1 > version2, 0 if equal
 */
function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part < v2Part) return -1;
    if (v1Part > v2Part) return 1;
  }

  return 0;
}

/**
 * Checks if a version is within the specified range (inclusive)
 * @param version - Version to check
 * @param from - Starting version of the range
 * @param to - Ending version of the range
 * @returns True if version is within range, false otherwise
 */
function isVersionInRange(version: string, from: string, to: string): boolean {
  return compareVersions(version, from) >= 0 && compareVersions(version, to) <= 0;
}

/**
 * Gets changelog entries for versions within a specified range
 * @param changelogContent - The raw changelog content as a string
 * @param from - Starting version of the range (e.g., "12.0.0")
 * @param to - Ending version of the range (e.g., "12.15.0")
 * @returns Object with version numbers as keys and descriptions as values for versions in range
 */
function getRangeChangelogs(changelogContent: string, from: string, to?: string): ParsedChangelog {
  const parsed = parseChangelog(changelogContent);
  const result: ParsedChangelog = {};

  // if to is not provided, return only the changelog for the version
  if (!to) {
    result[from] = parsed[from];
    return result;
  }

  for (const [version, description] of Object.entries(parsed)) {
    if (isVersionInRange(version, from, to)) {
      result[version] = description;
    }
  }

  return result;
}

function stringifyChangelog(changelog: ParsedChangelog): string {
  return Object.entries(changelog)
    .map(([version, description]) => {
      return `\n## ${version}\n${description}`;
    })
    .join('\n');
}

/**
 * Gets the latest version from the changelog
 * @param changelogContent - The raw changelog content as a string
 * @returns Object with latest version and its description, or null if no versions found
 */
function getLatestVersion(
  changelogContent: string,
): { version: string; description: string } | null {
  const parsed = parseChangelog(changelogContent);
  const versions = Object.keys(parsed);

  if (versions.length === 0) return null;

  // Sort versions in descending order (latest first)
  const sortedVersions = versions.sort((a, b) => {
    return compareVersions(b, a); // b, a for descending order
  });

  const latestVersion = sortedVersions[0];

  return {
    version: latestVersion,
    description: parsed[latestVersion],
  };
}

export { getRangeChangelogs, stringifyChangelog, getLatestVersion };
