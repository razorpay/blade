import { generateServerCode } from './blade/server';
import { convertIntoBladeNodes } from './figmaUtils/convertIntoNodes';
import type { BladeNode } from './types/Blade';

if (figma.editorType === 'dev' && figma.mode === 'codegen') {
  // Register a callback to the "generate" event
  figma.codegen.on('generate', async ({ node }) => {
    const convertedSelection: BladeNode[] = convertIntoBladeNodes([node], null);

    const code = await generateServerCode({
      bladeNodes: convertedSelection,
    });

    const minify = figma.codegen.preferences.customSettings.minifyOutput === 'yes';

    return [
      {
        title: 'Code',
        language: 'TYPESCRIPT',
        code: minify ? JSON.stringify(code) : JSON.stringify(code, null, 2),
      },
    ];
  });
} else {
  figma.notify('Razorsharp can only be run in Dev mode.');
  figma.closePlugin();
}
