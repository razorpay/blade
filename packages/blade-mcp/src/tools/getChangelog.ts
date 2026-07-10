import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import dedent from 'dedent';
import { z } from 'zod';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import {
  compareVersions,
  getLatestVersion,
  getRangeChangelogs,
  parseChangelog,
  stringifyChangelog,
} from '../utils/changelogParser.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';

const getChangelogToolName = 'get_blade_changelog';

const getChangelogToolDescription = `
Get the changelog of blade to help consumer with blade upgrades and checking release notes. Either for a specific version or a range of two versions,

Intent examples:
- help me with upgrades -> read \`package.json\` to get consumer's blade version to use it as \`fromVersion\` and then use \`toVersion\` as \`latest\` version (range)
- what was changed in x.x.x version? -> use \`fromVersion\` and omit \`toVersion\`
- what was changed between x.x.x and y.y.y versions? -> use both \`fromVersion\` and \`toVersion\`
- what is the latest version of blade? -> use \`fromVersion\` as \`latest\` and omit \`toVersion\`

You will provide high level summary of notable changes in this output format:

\`\`\`
# Key Changes to Watch Out For:
- **XYZ component changed (v12.0.0):** description of the change and how it impacts the consumer
# Visual Changes:
- **XYZ component** was updated to use new design tokens (v12.0.0)
# New Components:
- **XYZ** - Component was added (v12.0.0)
# Enhancements:
- **XYZ** now supports new prop (v12.0.0)
# Bug Fixes:
- **XYZ** now fixes a bug (v12.0.0)
# Breaking Changes:
- **XYZ** component was removed (v12.0.0)
\`\`\`

Hyperlinking:
Whenever you find blade versions mentioned ie \`(v12.0.0)\`, make sure to link it to release notes with this link:
https://github.com/razorpay/blade/releases/tag/%40razorpay%2Fblade%4012.0.0 
Example: \`(v12.0.0)\` becomes [(v12.0.0)](https://github.com/razorpay/blade/releases/tag/%40razorpay%2Fblade%4012.0.0)
`;

const versionPattern = /^\d+\.\d+\.\d+$/;
const changelogVersionSchema = z
  .string()
  .refine(
    (version) => version === 'latest' || versionPattern.test(version),
    'Expected "latest" or a semantic version such as 12.10.0',
  );

const getChangelogToolSchema = {
  fromVersion: changelogVersionSchema.describe(
    'The version to get, or the start version of a range. E.g. 10.15.0 or latest',
  ),
  toVersion: changelogVersionSchema
    .optional()
    .describe('The end version of a range. E.g. 10.16.0 or latest'),
  isRange: z
    .boolean()
    .optional()
    .describe(
      'Optional intent hint retained for compatibility. Providing toVersion always requests a range.',
    ),
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

const getChangelogToolCallback: ToolCallback<typeof getChangelogToolSchema> = async ({
  fromVersion,
  toVersion,
  isRange,
  currentProjectRootDirectory,
}) => {
  try {
    if (isRange && !toVersion) {
      return handleError({
        toolName: getChangelogToolName,
        mcpErrorMessage: '`toVersion` is required when `isRange` is true.',
      });
    }

    const changelogURL =
      'https://raw.githubusercontent.com/razorpay/blade/refs/heads/master/packages/blade/CHANGELOG.md';
    const response = await fetch(changelogURL, {
      method: 'GET',
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return handleError({
        toolName: getChangelogToolName,
        mcpErrorMessage: `Failed to fetch Blade changelog (HTTP ${response.status}). Please try again.`,
      });
    }

    const changelogText = await response.text();
    const availableChangelog = parseChangelog(changelogText);
    const latestVersion = getLatestVersion(changelogText);

    if (!latestVersion) {
      return handleError({
        toolName: getChangelogToolName,
        mcpErrorMessage: 'The Blade changelog did not contain any release entries.',
      });
    }

    fromVersion = fromVersion === 'latest' ? latestVersion.version : fromVersion;
    toVersion = toVersion === 'latest' ? latestVersion.version : toVersion;

    if (!availableChangelog[fromVersion]) {
      return handleError({
        toolName: getChangelogToolName,
        mcpErrorMessage: `No Blade changelog entry was found for ${fromVersion}. The latest available version is ${latestVersion.version}.`,
      });
    }

    if (toVersion && !availableChangelog[toVersion]) {
      return handleError({
        toolName: getChangelogToolName,
        mcpErrorMessage: `No Blade changelog entry was found for ${toVersion}. The latest available version is ${latestVersion.version}.`,
      });
    }

    if (toVersion && compareVersions(fromVersion, toVersion) > 0) {
      return handleError({
        toolName: getChangelogToolName,
        mcpErrorMessage: `Invalid Blade changelog range: fromVersion (${fromVersion}) must be less than or equal to toVersion (${toVersion}).`,
      });
    }

    const parsedChangelog = getRangeChangelogs(changelogText, fromVersion, toVersion);

    if (!parsedChangelog) {
      return handleError({
        toolName: getChangelogToolName,
        mcpErrorMessage: 'Failed to resolve the requested Blade changelog entries.',
      });
    }

    const stringifiedChangelog = stringifyChangelog(parsedChangelog);
    const isRangeRequest = Boolean(toVersion);

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getChangelogToolName,
        fromVersion,
        toVersion,
        currentProjectRootDirectory,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: dedent`
            ## Changelog for: ${
              isRangeRequest
                ? `range from ${fromVersion} to ${toVersion}`
                : `version ${fromVersion}`
            }

            \`\`\`
            ${stringifiedChangelog}
            \`\`\`
          `,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getChangelogToolName,
      mcpErrorMessage: `Failed to fetch Blade changelog: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
};

export {
  getChangelogToolCallback,
  getChangelogToolName,
  getChangelogToolDescription,
  getChangelogToolSchema,
};
