const bashScriptContent = `
  #!/bin/bash
  # Download frontend-blade-rules.mdc from GitHub and save to .cursor/rules
  TARGET_DIR=".cursor/rules"
  URL="https://raw.githubusercontent.com/razorpay/blade/master/packages/blade-mcp/cursorRules/frontend-blade-rules.mdc"
  FILE_PATH="$TARGET_DIR/frontend-blade-rules.mdc"
  # Create directory if it doesn't exist (works even if it already exists)
  mkdir -p "$TARGET_DIR"
  curl -sSL "$URL" -o "$FILE_PATH"
  `;

const createCursorRuleCreationInstructions = ({
  currentProjectRootDirectory,
  CURSOR_RULES_VERSION,
}: {
  currentProjectRootDirectory: string;
  CURSOR_RULES_VERSION: string;
}): string => `
**Instructions:**

1. Change to the working directory: \`cd "${currentProjectRootDirectory}"\`

2. Run the bash script below (copy and execute the commands from the script)

3. This will create the cursor rules file at \`.cursor/rules/frontend-blade-rules.mdc\`

4. After file is create replate \`rules_version: <!-- dynamic_version --> \` in file with \`rules_version: ${CURSOR_RULES_VERSION}\`

Run the following bash script to create cursor rules:

**Bash Script:**

\`\`\`bash
${bashScriptContent}
\`\`\`

**Working Directory:** \`${currentProjectRootDirectory}\`
`;
export { bashScriptContent, createCursorRuleCreationInstructions };
