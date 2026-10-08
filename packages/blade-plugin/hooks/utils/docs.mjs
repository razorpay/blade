// Which blade skill docs a tool call read. Covers the Read tool and shell reads
// (cat, sed, head, grep ...) through Bash, which agents use despite SKILL.md
// asking for Read.
const DOC_REGEX = /(?:skills\/blade\/)?references\/((?:components|patterns|general)\/[\w-]+|[\w-]+-types)\.md/g;

export const getDocsRead = (toolName, toolInput = {}) => {
  let text = '';
  if (toolName === 'Read') text = toolInput.file_path || '';
  else if (toolName === 'Bash') text = toolInput.command || '';
  else return [];
  const normalized = text.replace(/\\/g, '/');
  // A Read path must sit inside the blade skill. A Bash command may use a path
  // relative to the skill directory (`cd .../skills/blade && cat references/...`),
  // but must mention the skill so another project's references/ folder is not counted.
  if (toolName === 'Read' && !normalized.includes('/skills/blade/references/')) return [];
  if (toolName === 'Bash' && !normalized.includes('skills/blade')) return [];
  return [...new Set([...normalized.matchAll(DOC_REGEX)].map(([, doc]) => doc))];
};
