import { join, basename } from 'path';
import {
  existsSync,
  symlinkSync,
  unlinkSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from 'fs';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  BLADE_SKILL_FILE_PATH,
  SKILL_VERSION,
  SKILL_DIRECTORY_NAME,
  SKILL_REFERENCES_DIRECTORY,
  analyticsToolCallEventName,
} from '../utils/tokens.js';

import { hasOutdatedSkill } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
// eslint-disable-next-line import/no-cycle
import { skillCreationInstructions } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';

const createBladeSkillToolName = 'create_blade_skill';

const createBladeSkillToolDescription =
  'Creates the UI code guidelines skill for AI-assisted frontend code generation with Blade. Scaffolds the skill in .agents/skills/ui-code-guidelines and creates a symlink in .claude/skills for Claude Code support.';

const createBladeSkillToolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
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

    const skillDir = join(
      currentProjectRootDirectory,
      '.agents/skills',
      SKILL_DIRECTORY_NAME,
    );
    const skillFilePath = join(skillDir, 'SKILL.md');

    if (existsSync(skillFilePath)) {
      if (hasOutdatedSkill(skillFilePath)) {
        // removes the outdated skill file and continues execution to generate new skill file
        unlinkSync(skillFilePath);
      } else {
        return {
          content: [{ type: 'text', text: 'Blade skill already exists and is up to date. Doing nothing' }],
        };
      }
    }

    const skillFileTemplateContent = readFileSync(BLADE_SKILL_FILE_PATH, 'utf8');

    if (!existsSync(skillDir)) {
      mkdirSync(skillDir, { recursive: true });
    }

    writeFileSync(skillFilePath, skillFileTemplateContent);

    // Copy reference files
    const refsSourceDir = SKILL_REFERENCES_DIRECTORY;
    const refsDestDir = join(skillDir, 'references');
    if (existsSync(refsSourceDir)) {
      if (!existsSync(refsDestDir)) {
        mkdirSync(refsDestDir, { recursive: true });
      }
      const refFiles = readdirSync(refsSourceDir);
      for (const refFile of refFiles) {
        const refContent = readFileSync(join(refsSourceDir, refFile), 'utf8');
        writeFileSync(join(refsDestDir, refFile), refContent);
      }
    }

    // Create symlink for Claude Code support
    const claudeSkillsDir = join(currentProjectRootDirectory, '.claude/skills');
    const symlinkPath = join(claudeSkillsDir, SKILL_DIRECTORY_NAME);

    if (!existsSync(claudeSkillsDir)) {
      mkdirSync(claudeSkillsDir, { recursive: true });
    }

    if (!existsSync(symlinkPath)) {
      // Relative symlink: .claude/skills/ui-code-guidelines -> ../../.agents/skills/ui-code-guidelines
      symlinkSync(
        join('..', '..', '.agents', 'skills', SKILL_DIRECTORY_NAME),
        symlinkPath,
      );
    }

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
