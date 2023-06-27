import { generateBladeCode } from './blade/main';
import { generateImportsCode } from './blade/utils/imports';
import { convertIntoBladeNodes } from './figmaUtils/convertIntoNodes';
import type { BladeNode } from './types/Blade';

if (figma.editorType === 'dev' && figma.mode === 'codegen') {
  // Register a callback to the "generate" event
  figma.codegen.on('generate', ({ node }) => {
    if (!node) {
      figma.notify('Please select a node to generate code');
      return;
    }

    const convertedSelection: BladeNode[] = convertIntoBladeNodes(
      figma.currentPage.selection,
      null,
    );

    const { component, imports } = generateBladeCode({
      bladeNodes: convertedSelection,
    });

    return [
      {
        title: 'Blade',
        language: 'TYPESCRIPT',
        code: generateImportsCode(imports ?? {}).trim() + '\n\n' + component.trim(),
      },
    ];
  });
}
