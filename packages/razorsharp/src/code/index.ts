import { generateServerCode } from './blade/server';
import { convertIntoBladeNodes } from './figmaUtils/convertIntoNodes';
import type { BladeNode } from './types/Blade';

if (figma.editorType === 'dev' && figma.mode === 'codegen') {
  // Register a callback to the "generate" event
  figma.codegen.on('generate', ({ node }) => {
    const convertedSelection: BladeNode[] = convertIntoBladeNodes([node], null);

    const code = generateServerCode({
      bladeNodes: convertedSelection,
    });

    return [
      {
        title: 'Code',
        language: 'TYPESCRIPT',
        code: JSON.stringify(code, null, 2),
      },
    ];
  });
} else {
  figma.notify('Razorsharp can only be run in Dev mode.');
  figma.closePlugin();
}
