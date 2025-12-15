import { z } from 'zod';
import { CHECK_CURSOR_RULES_DESCRIPTION } from '../utils/tokens.js';

/**
 * Common schema fields shared across Blade MCP tools
 */
const commonBladeMCPToolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
  clientName: z
    .enum(['claude', 'cursor', 'unknown'])
    .default('unknown')
    .describe(
      'The name of the client that is calling the tool. It can be "claude", "cursor", or "unknown".',
    ),
};

/**
 * Schema field for HTTP transport that includes cursor rule version check
 */
const httpTransportCursorRuleVersionSchema = {
  cursorRuleVersion: z.string().describe(CHECK_CURSOR_RULES_DESCRIPTION),
};

export { httpTransportCursorRuleVersionSchema, commonBladeMCPToolSchema };
