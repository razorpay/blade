import { generateBladeCode } from './blade/main';
import { generateImportsCode } from './blade/utils/imports';
import { convertIntoBladeNodes } from './figmaUtils/convertIntoNodes';
import type { BladeNode } from './types/Blade';

if (figma.editorType === 'dev' && figma.mode === 'codegen') {
  // Register a callback to the "generate" event
  figma.codegen.on('generate', ({ node }) => {
    const convertedSelection: BladeNode[] = convertIntoBladeNodes([node], null);

    const { component, imports } = generateBladeCode({
      bladeNodes: convertedSelection,
    });

    return [
      {
        title: 'Imports',
        language: 'TYPESCRIPT',
        code: generateImportsCode(imports ?? {}).trim(),
      },
      {
        title: 'Code',
        language: 'TYPESCRIPT',
        code: component.trim(),
      },
    ];
  });
}
