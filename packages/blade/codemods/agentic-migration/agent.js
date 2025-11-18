#!/usr/bin/env node

const { spawn } = require('child_process');

const colors = {
  bold: (message) => `\x1b[1m${message}\x1b[0m`,
  green: (message) => `\x1b[32m${message}\x1b[0m`,
  boldGreen: (message) => colors.bold(colors.green(message)),
  blue: (message) => `\x1b[34m${message}\x1b[0m`,
  boldBlue: (message) => colors.bold(colors.blue(message)),
  red: (message) => `\x1b[31m${message}\x1b[0m`,
  boldRed: (message) => colors.bold(colors.red(message)),
};

const logger = {
  toolCall: ({ message, type }) => {
    console.log(colors.boldGreen(`🔨 tool_call (${type.replace('ToolCall', '')}):`), message);
  },
  system: ({ key, message }) => {
    console.log(colors.boldBlue(`🤖 ${key}:`), `${message}`);
  },
  stats: (tableObject) => {
    console.log(colors.boldGreen('\n\n🎯 final stats:'));
    console.table(tableObject);
  },
  stdout: (message) => {
    process.stdout.write(message);
  },
  stderr: (message) => {
    process.stderr.write(message);
  },
  error: (message) => {
    console.error(colors.boldRed(message));
  },
};

logger.system({
  key: 'init',
  message: 'Agent is getting initiated...',
});

let accumulatedText = '';
let toolCount = 0;
const startTime = Date.now();

// Read prompt from CLI arguments
const userPrompt = process.argv.slice(2).join(' ');
if (!userPrompt) {
  logger.error('Usage: stream.js <prompt>');
  process.exit(1);
}

// Spawn the cursor-agent process
const cursorAgent = spawn(
  'cursor-agent',
  ['-p', '--force', '--approve-mcps', '--output-format', 'stream-json', '--browser', userPrompt],
  {
    stdio: ['ignore', 'pipe', 'pipe'], // ignore stdin, pipe stdout/stderr
  },
);

let buffer = '';

// Handle stdout data
cursorAgent.stdout.on('data', (data) => {
  buffer += data.toString();

  // Process complete lines
  const lines = buffer.split('\n');
  buffer = lines.pop() || ''; // Keep incomplete line in buffer

  lines.forEach((line) => {
    if (!line.trim()) return;

    try {
      const json = JSON.parse(line);
      const type = json.type || '';
      const subtype = json.subtype || '';

      switch (type) {
        case 'system':
          if (subtype === 'init') {
            const model = json.model || 'unknown';
            logger.system({
              key: 'model',
              message: model,
            });
          }
          break;

        case 'assistant': {
          // Accumulate incremental text deltas for smooth progress
          const content = json.message?.content?.[0]?.text || '';
          // timestamp is present in the streamed output
          logger.stdout(content);
          accumulatedText += content;

          break;
        }

        case 'tool_call':
          if (subtype === 'started') {
            toolCount++;
            // Extract tool information
            const toolType = Object.keys(json.tool_call)[0];

            switch (toolType) {
              case 'writeToolCall': {
                const path = json.tool_call.writeToolCall.args?.path || 'unknown';
                logger.toolCall({
                  type: toolType,
                  message: `Creating ${path}`,
                });
                break;
              }

              case 'readToolCall': {
                const path = json.tool_call.readToolCall.args?.path || 'unknown';
                logger.toolCall({
                  type: toolType,
                  message: `Reading ${path}`,
                });
                break;
              }

              case 'editToolCall': {
                const path = json.tool_call.editToolCall.args?.path || 'unknown';
                logger.toolCall({
                  type: toolType,
                  message: `Editing ${path}`,
                });
                break;
              }

              case 'lsToolCall': {
                const path = json.tool_call.lsToolCall.args?.path || 'unknown';
                logger.toolCall({
                  type: toolType,
                  message: `Listing files in ${path}`,
                });
                break;
              }

              case 'shellToolCall': {
                const command = json.tool_call.shellToolCall.args?.command;
                logger.toolCall({
                  type: toolType,
                  message: `Running ${command}`,
                });
                break;
              }

              case 'mcpToolCall': {
                const mcpName = json.tool_call.mcpToolCall.args?.providerIdentifier;
                const mcpToolName = json.tool_call.mcpToolCall.args?.toolName;
                const mcpParams = json.tool_call.mcpToolCall.args?.args;
                logger.toolCall({
                  type: `${mcpName}`,
                  message: `${mcpToolName} (${JSON.stringify(mcpParams)})`,
                });
                break;
              }

              default: {
                logger.toolCall({
                  type: toolType,
                  message: json.tool_call[toolType].args,
                });
              }
            }
          }
          break;
        case 'result': {
          const duration = json.duration_ms || 0;
          const endTime = Date.now();
          const totalTime = Math.floor((endTime - startTime) / 1000);
          logger.stats({
            'Tool Calls': toolCount,
            'Chars Generated': accumulatedText.length,
            Duration: `${duration}ms (${totalTime}s total)`,
          });
          break;
        }

        default:
          break;
      }
    } catch (error) {
      // Ignore JSON parse errors for incomplete lines
      // They will be processed when the complete line arrives
    }
  });
});

// Handle stderr
cursorAgent.stderr.on('data', (data) => {
  logger.stderr(data.toString());
});

// Handle process exit
cursorAgent.on('close', (code) => {
  if (code !== 0) {
    logger.error(`\n❌ Process exited with code ${code}`);
    process.exit(code);
  }
});

// Handle errors
cursorAgent.on('error', (error) => {
  logger.error(`\n❌ Error spawning cursor-agent: ${error.message}`);
  process.exit(1);
});
