import { join, basename } from 'path';
import { existsSync, symlinkSync, mkdirSync, rmSync, cpSync, lstatSync } from 'fs';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  BLADE_SKILL_DIRECTORY,
  SKILL_VERSION,
  SKILL_DIRECTORY_NAME,
  SKILL_FILE_NAME,
  CONSUMER_SKILL_DIRECTORY_RELATIVE_PATH,
  CONSUMER_SKILL_SYMLINK_RELATIVE_PATH,
  CONSUMER_LEGACY_SKILL_DIRECTORY_RELATIVE_PATH,
  CONSUMER_LEGACY_SKILL_SYMLINK_RELATIVE_PATH,
  analyticsToolCallEventName,
} from '../utils/tokens.js';

import { hasOutdatedSkill } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
// eslint-disable-next-line import/no-cycle
import { skillCreationInstructions } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';

const createBladeSkillToolName = 'create_blade_skill';

const createBladeSkillToolDescription =
  'Installs the blade skill (Blade component, pattern and token docs) into the consumer project for AI-assisted frontend code generation. Scaffolds .agents/skills/blade and symlinks .claude/skills/blade for Claude Code. Not needed when the Blade Claude Code plugin is installed.';

const createBladeSkillToolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

const removeIfExists = (path: string): void => {
  try {
    lstatSync(path);
  } catch {
    return;
  }
  rmSync(path, { recursive: true, force: true });
};

// Core business logic function
const createBladeSkillCore = ({
  currentProjectRootDirectory,
  isHttpTransport = false,
}: {
  currentProjectRootDirectory: string;
  isHttpTransport?: boolean;
}): McpToolResponse => {
  try {
    // For HTTP transport, return instructions instead of creating the file directly
    if (isHttpTransport) {
      sendAnalytics({
        eventName: analyticsToolCallEventName,
        properties: {
          toolName: createBladeSkillToolName,
          skillVersion: SKILL_VERSION,
          rootDirectoryName: basename(currentProjectRootDirectory),
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: skillCreationInstructions({ currentProjectRootDirectory }),
          },
        ],
      };
    }

    const skillDir = join(currentProjectRootDirectory, CONSUMER_SKILL_DIRECTORY_RELATIVE_PATH);
    const skillFilePath = join(skillDir, SKILL_FILE_NAME);

    if (existsSync(skillFilePath) && !hasOutdatedSkill(skillFilePath)) {
      return {
        content: [
          { type: 'text', text: 'Blade skill already exists and is up to date. Doing nothing' },
        ],
      };
    }

    // Replace the whole tree so removed reference docs do not linger.
    removeIfExists(skillDir);
    mkdirSync(skillDir, { recursive: true });
    cpSync(BLADE_SKILL_DIRECTORY, skillDir, { recursive: true });

    // Create symlink for Claude Code support
    const claudeSkillsDir = join(currentProjectRootDirectory, '.claude/skills');
    const symlinkPath = join(currentProjectRootDirectory, CONSUMER_SKILL_SYMLINK_RELATIVE_PATH);

    if (!existsSync(claudeSkillsDir)) {
      mkdirSync(claudeSkillsDir, { recursive: true });
    }

    if (!existsSync(symlinkPath)) {
      // Relative symlink: .claude/skills/blade -> ../../.agents/skills/blade
      symlinkSync(join('..', '..', '.agents', 'skills', SKILL_DIRECTORY_NAME), symlinkPath);
    }

    // The ui-code-guidelines skill is superseded by the blade skill.
    removeIfExists(join(currentProjectRootDirectory, CONSUMER_LEGACY_SKILL_SYMLINK_RELATIVE_PATH));
    removeIfExists(
      join(currentProjectRootDirectory, CONSUMER_LEGACY_SKILL_DIRECTORY_RELATIVE_PATH),
    );

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: createBladeSkillToolName,
        skillVersion: SKILL_VERSION,
        rootDirectoryName: basename(currentProjectRootDirectory),
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: `Blade skill created at: ${skillFilePath}. Symlink created at: ${symlinkPath}. Skill Version: ${SKILL_VERSION}`,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: createBladeSkillToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const createBladeSkillStdioCallback: ToolCallback<typeof createBladeSkillToolSchema> = ({
  currentProjectRootDirectory,
}) => {
  return createBladeSkillCore({
    currentProjectRootDirectory,
    isHttpTransport: false,
  });
};

// Callback for HTTP transport
const createBladeSkillHttpCallback: ToolCallback<typeof createBladeSkillToolSchema> = ({
  currentProjectRootDirectory,
}) => {
  return createBladeSkillCore({
    currentProjectRootDirectory,
    isHttpTransport: true,
  });
};

export {
  createBladeSkillToolName,
  createBladeSkillToolDescription,
  createBladeSkillToolSchema,
  createBladeSkillStdioCallback,
  createBladeSkillHttpCallback,
};
