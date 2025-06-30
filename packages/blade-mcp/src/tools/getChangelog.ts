import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import dedent from 'dedent';
import { z } from 'zod';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import {
  getLatestVersion,
  getRangeChangelogs,
  stringifyChangelog,
} from '../utils/changelogParser.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';

const getChangelogToolName = 'get_blade_changelog';

const getChangelogToolDescription = `
Get the changelog of blade to help consumer with blade upgrades and checking release notes. Either for a specific version or a range of two versions,

Intent examples:
- help me with upgrades -> read \`package.json\` to get consumer's blade version to use it as \`fromVersion\` and then use \`toVersion\` as \`latest\` version (range)
- what was changed in x.x.x version? -> Just \`fromVersion\` (set isRange to false & omit toVersion)
- what was changed between x.x.x and y.y.y versions? -> \`fromVersion\` and \`toVersion\` (set isRange to true)
`;

const getChangelogToolSchema = {
  fromVersion: z
    .string()
    .describe('The start version of the range to get the changelog for. E.g. 10.15.0'),
  toVersion: z
    .string()
    .optional()
    .describe('The end version of the range to get the changelog for. E.g. 10.16.0'),
  isRange: z
    .boolean()
    .optional()
    .describe(
      'Whether to get the changelog for a range of versions or a specific version, this is based on intent of user.',
    ),
};

const getChangelogToolCallback: ToolCallback<typeof getChangelogToolSchema> = async ({
  fromVersion,
  toVersion,
  isRange,
}) => {
  try {
    const changelogURL =
      'https://raw.githubusercontent.com/razorpay/blade/refs/heads/master/packages/blade/CHANGELOG.md';
    const response = await fetch(changelogURL, {
      method: 'GET',
    });
    const changelogText = await response.text();

    const isToVersionLatest = toVersion === 'latest';
    if (isToVersionLatest) {
      const latestVersion = getLatestVersion(changelogText);
      toVersion = latestVersion?.version;
    }

    const parsedChangelog = getRangeChangelogs(changelogText, fromVersion, toVersion);
    const stringifiedChangelog = stringifyChangelog(parsedChangelog);

    if (parsedChangelog === undefined) {
      return handleError({
        toolName: getChangelogToolName,
        mcpErrorMessage: `Failed to fetch changelog.`,
      });
    }

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getChangelogToolName,
        fromVersion,
        toVersion,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: dedent`
            ## Changelog for: ${
              isRange ? `range from ${fromVersion} to ${toVersion}` : `version ${fromVersion}`
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
      mcpErrorMessage: `Failed to fetch changelog, ${error}`,
    });
  }
};

export {
  getChangelogToolCallback,
  getChangelogToolName,
  getChangelogToolDescription,
  getChangelogToolSchema,
};
