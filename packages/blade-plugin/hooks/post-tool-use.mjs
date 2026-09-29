// PostToolUse: record which files were edited and which Blade docs or skills
// were used in this session. Only runs when session-start marked the session
// as a Blade project (its session file exists). Never blocks the tool.
import fs from 'fs';
import path from 'path';
import {
  readStdinJSON,
  getSessionFile,
  readJSON,
  writeJSON,
  logError,
} from './utils/analytics.mjs';
import { getDocName } from './utils/frameworks.mjs';

const CODE_EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js', '.svelte']);

const main = async () => {
  const input = await readStdinJSON();
  const sessionFile = getSessionFile(input.session_id);
  if (!fs.existsSync(sessionFile)) return;

  const session = readJSON(sessionFile, null);
  if (!session) return;

  const toolName = input.tool_name || '';
  const toolInput = input.tool_input || {};
  let changed = false;

  if (toolName === 'Skill') {
    const skill = toolInput.skill || toolInput.name || '';
    if (skill.includes('blade') && !session.skillsUsed.includes(skill)) {
      session.skillsUsed.push(skill);
      changed = true;
    }
  } else if (toolName === 'Read') {
    const doc = getDocName(toolInput.file_path || '');
    if (doc) {
      if (!session.docsRead.includes(doc)) {
        session.docsRead.push(doc);
        changed = true;
      }
    }
  } else {
    const filePath = toolInput.file_path || '';
    if (
      filePath &&
      CODE_EXTENSIONS.has(path.extname(filePath)) &&
      !session.editedFiles.includes(filePath)
    ) {
      session.editedFiles.push(filePath);
      changed = true;
    }
  }

  if (changed) writeJSON(sessionFile, session);
};

main().catch((error) => logError('post-tool-use', error));
