import { existsSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line import/no-cycle
import { createBladeSkillToolName } from '../tools/createBladeSkill.js';
import {
  SKILL_VERSION,
  CONSUMER_SKILL_RELATIVE_PATH,
  CONSUMER_SKILL_DIRECTORY_RELATIVE_PATH,
  CONSUMER_SKILL_SYMLINK_RELATIVE_PATH,
  CONSUMER_LEGACY_SKILL_DIRECTORY_RELATIVE_PATH,
  CONSUMER_LEGACY_SKILL_SYMLINK_RELATIVE_PATH,
  BLADE_SKILL_GIT_PATH,
  SKILL_DIRECTORY_NAME,
} from './tokens.js';
import { hasOutdatedSkill } from './generalUtils.js';
import { handleError } from './analyticsUtils.js';
import type { McpToolResponse } from './types.js';

// degit copies the whole skill tree (SKILL.md + ~110 reference docs) in one
// command; per-file curl no longer scales.
const bashScriptContent = `
  #!/bin/bash
  # Install the blade skill from GitHub (SKILL.md + references)
  SKILL_DIR="${CONSUMER_SKILL_DIRECTORY_RELATIVE_PATH}"
  SYMLINK_DIR="${CONSUMER_SKILL_SYMLINK_RELATIVE_PATH}"
  rm -rf "$SKILL_DIR"
  mkdir -p "$SKILL_DIR"
  npx -y degit ${BLADE_SKILL_GIT_PATH} "$SKILL_DIR" --force
  # Create symlink for Claude Code support
  mkdir -p ".claude/skills"
  if [ ! -L "$SYMLINK_DIR" ] && [ ! -e "$SYMLINK_DIR" ]; then
    ln -s "../../${CONSUMER_SKILL_DIRECTORY_RELATIVE_PATH}" "$SYMLINK_DIR"
  fi
  # Remove the legacy ui-code-guidelines skill superseded by the blade skill
  rm -rf "${CONSUMER_LEGACY_SKILL_DIRECTORY_RELATIVE_PATH}" "${CONSUMER_LEGACY_SKILL_SYMLINK_RELATIVE_PATH}"
  `;

const skillCreationInstructions = ({
  currentProjectRootDirectory,
}: {
  currentProjectRootDirectory: string;
}): string => `
**Instructions:**

1. Change to the working directory: \`cd "${currentProjectRootDirectory}"\`

2. Run the bash script below (copy and execute the commands from the script)

3. This will create the blade skill at \`${CONSUMER_SKILL_RELATIVE_PATH}\` and a symlink at \`${CONSUMER_SKILL_SYMLINK_RELATIVE_PATH}\`

Run the following bash script to create the blade skill:

**Bash Script:**

\`\`\`bash
${bashScriptContent}
\`\`\`

**Working Directory:** \`${currentProjectRootDirectory}\`

Alternatively, install the Blade Claude Code plugin, which ships the same \`${SKILL_DIRECTORY_NAME}\` skill and needs no MCP: https://github.com/razorpay/blade/tree/master/packages/blade-plugin
`;

/**
 * Checks if the skill file is missing based on version (for HTTP transport)
 * @param skillVersion - The version of the skill
 * @returns true if skill file is missing, false otherwise
 */
function isSkillFileMissing(skillVersion: string): boolean {
  return skillVersion === '0';
}

/**
 * Checks if the skill is outdated (version doesn't match the latest version)
 * @param skillVersion - The version of the skill
 * @returns true if skill is outdated, false otherwise
 */
function isSkillOutdated(skillVersion: string): boolean {
  return skillVersion !== SKILL_VERSION;
}

/**
 * Checks if the blade skill should be created or updated. Returns instructions if needed.
 * This function checks both the file system and version numbers to determine if the skill needs attention.
 * @param skillVersion - The version of the skill
 * @param currentProjectRootDirectory - The working root directory of the consumer's project
 * @param skipLocalSkillChecks - If true, skip file system checks and only check versions (for HTTP transport)
 * @param toolName - The name of the tool calling this function (for error messages)
 * @returns Error/content format if skill needs attention, undefined otherwise
 */
function shouldCreateOrUpdateSkill(
  skillVersion = '0',
  currentProjectRootDirectory: string,
  skipLocalSkillChecks = false,
  toolName?: string,
): McpToolResponse | undefined {
  let isMissing = false;

  // Check file system first if directory is provided and skipLocalSkillChecks is false
  if (currentProjectRootDirectory && !skipLocalSkillChecks) {
    const skillFilePath = join(currentProjectRootDirectory, CONSUMER_SKILL_RELATIVE_PATH);

    // Check if file exists
    if (!existsSync(skillFilePath)) {
      isMissing = true;
    } else if (hasOutdatedSkill(skillFilePath)) {
      // File exists but is outdated
      isMissing = false;
    } else {
      // File exists and is up to date
      return undefined;
    }
  }

  // Fallback to version-based checks if file system checks were skipped
  if (!currentProjectRootDirectory || skipLocalSkillChecks) {
    if (isSkillFileMissing(skillVersion)) {
      isMissing = true;
    } else if (isSkillOutdated(skillVersion)) {
      isMissing = false;
    } else {
      // Skill is up to date
      return undefined;
    }
  }

  // For stdio transport (skipLocalSkillChecks = false), return error format
  if (!skipLocalSkillChecks && toolName) {
    return handleError({
      toolName,
      mcpErrorMessage: isMissing
        ? `Blade skill does not exist. Call \`${createBladeSkillToolName}\` first.`
        : `Blade skill is outdated. Call \`${createBladeSkillToolName}\` first to update the skill`,
    });
  }

  // For HTTP transport (skipLocalSkillChecks = true), return content format
  return {
    content: [
      {
        type: 'text',
        text: isMissing
          ? `Blade skill does not exist. Create it using the following instructions: \n\n
          ${skillCreationInstructions({
            currentProjectRootDirectory,
          })}`
          : `Blade skill is outdated. Expected version: ${SKILL_VERSION}. Current version: ${skillVersion}. Update it using the following instructions: \n\n
          ${skillCreationInstructions({
            currentProjectRootDirectory,
          })}`,
      },
    ],
  };
}

export {
  bashScriptContent,
  skillCreationInstructions,
  shouldCreateOrUpdateSkill,
  isSkillOutdated,
  isSkillFileMissing,
};
