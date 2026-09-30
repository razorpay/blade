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
import { CODE_EXTENSIONS } from './utils/lineStats.mjs';
import { getDocsRead } from './utils/docs.mjs';

const addUnique = (list, value) => {
  if (!value || list.includes(value)) return false;
  list.push(value);
  return true;
};

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
    if (skill.includes('blade')) changed = addUnique(session.skillsUsed, skill);
  } else if (toolName === 'Read' || toolName === 'Bash') {
    for (const doc of getDocsRead(toolName, toolInput)) {
      changed = addUnique(session.docsRead, doc) || changed;
    }
  } else {
    const filePath = toolInput.file_path || '';
    if (CODE_EXTENSIONS.has(path.extname(filePath)))
      changed = addUnique(session.editedFiles, filePath);
  }

  if (changed) writeJSON(sessionFile, session);
};

main().catch((error) => logError('post-tool-use', error));
