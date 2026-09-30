// Which Blade skill docs a tool call read. Covers the Read tool and shell reads
// (cat, sed, head, grep ...) through Bash, which agents use despite SKILL.md
// asking for Read. React docs keep bare names (components/Button) so existing
// dashboards match; other Blade skills are prefixed (blade-svelte/components/Button).
const DOC_REGEX = /(?:skills\/(blade[\w-]*)\/)?references\/((?:components|patterns|general)\/[\w-]+|[\w-]+-types)\.md/g;
const SKILL_REGEX = /skills\/(blade[\w-]*)(?:\/|\b)/;

const docName = (skill, doc) => (skill === 'blade' ? doc : `${skill}/${doc}`);

export const getDocsRead = (toolName, toolInput = {}) => {
  let text = '';
  if (toolName === 'Read') text = toolInput.file_path || '';
  else if (toolName === 'Bash') text = toolInput.command || '';
  else return [];
  const normalized = text.replace(/\\/g, '/');
  // A Read path must sit inside a Blade skill. A Bash command may use a path
  // relative to the skill directory (`cd .../skills/blade-svelte && cat references/...`),
  // but must mention the skill so another project's references/ folder is not counted.
  const commandSkill = SKILL_REGEX.exec(normalized)?.[1];
  if (!commandSkill) return [];
  if (toolName === 'Read' && !/\/skills\/blade[\w-]*\/references\//.test(normalized)) return [];
  const docs = [...normalized.matchAll(DOC_REGEX)].map(([, skill, doc]) =>
    docName(skill ?? commandSkill, doc),
  );
  return [...new Set(docs)];
};
