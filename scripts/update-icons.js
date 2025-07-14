const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../packages/blade/src/components/Icons');

// Helper function to update a single icon file
function updateIconFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const iconName = path.basename(filePath, '.tsx');
  
  // Skip if file already has assignWithoutSideEffects
  if (content.includes('assignWithoutSideEffects')) {
    console.log(`Skipping ${iconName} - already updated`);
    return;
  }

  // Add import
  let newContent = content.replace(
    "import useIconProps from '../useIconProps';",
    "import useIconProps from '../useIconProps';\nimport { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';"
  );

  // Rename component
  newContent = newContent.replace(
    `const ${iconName}: IconComponent`,
    `const _${iconName}: IconComponent`
  );

  // Add assignWithoutSideEffects and exports
  newContent = newContent.replace(
    `export default ${iconName};`,
    `const ${iconName} = assignWithoutSideEffects(_${iconName}, {
  componentId: '${iconName}',
});

export { _${iconName} };
export default ${iconName};`
  );

  fs.writeFileSync(filePath, newContent);
  console.log(`Updated ${iconName}`);
}

// Process all icon files
function updateAllIcons() {
  const files = fs.readdirSync(ICONS_DIR);
  
  files.forEach(file => {
    const filePath = path.join(ICONS_DIR, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Check for TSX file in the directory
      const tsxFile = path.join(filePath, `${file}.tsx`);
      if (fs.existsSync(tsxFile)) {
        updateIconFile(tsxFile);
      }
    }
  });
}

updateAllIcons(); 