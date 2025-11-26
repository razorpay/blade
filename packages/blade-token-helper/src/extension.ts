import * as vscode from 'vscode';
import * as tokens from "./theme/theme.json";
import { debounce } from './utils/debounce';


const colorTokens = tokens.theme.colors;
const spacingTokens = tokens.theme.spacing;

// Helper function to get nested color value from dot notation path
function getColorValue(path: string): string | undefined {
  const parts = path.split('.');
  let current = colorTokens;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  
  return typeof current === 'string' ? current : undefined;
}

// Helper function to get spacing value
function getSpacingValue(key: string): number | undefined {
  return spacingTokens[key as keyof typeof spacingTokens];
}

// Helper function to check if a path is a valid color token
function isValidColorPath(path: string): boolean {
  return getColorValue(path) !== undefined;
}


// Helper function to determine if a color is light or dark
function isLightColor(hslaColor: string): boolean {
  const hslaMatch = hslaColor.match(/hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([\d.]+)\)/);
  if (hslaMatch) {
    const lightness = parseInt(hslaMatch[3], 10);
    return lightness > 50; // If lightness > 50%, it's a light color
  }
  return false; // Default to dark if we can't parse
}

// Create decoration types with better readability
const createColorDecoration = (color: string) => {
  const isLight = isLightColor(color);
  
  return vscode.window.createTextEditorDecorationType({
    backgroundColor: color,
    color: isLight ? '#000000' : '#ffffff', // Dark text on light bg, light text on dark bg
    border: `2px solid ${isLight ? '#00000040' : '#ffffff40'}`,
    borderRadius: '3px',
    fontWeight: '500' // Make text slightly bolder for better readability
  });
};

// Spacing value decoration: shows computed px as a subtle inline label after the token
const spacingValueDecoration = vscode.window.createTextEditorDecorationType({
  after: {
    margin: '0 0 0 6px',
    color: new vscode.ThemeColor('editorCodeLens.foreground')
  }
});

let activeEditor = vscode.window.activeTextEditor;
const colorDecorations: Map<string, vscode.TextEditorDecorationType> = new Map();



function updateDecorations() {
  if (!activeEditor) {
    return;
  }

  const document = activeEditor.document;
  const text = document.getText();
  const colorMatches: Map<string, vscode.Range[]> = new Map();
  const spacingOptions: vscode.DecorationOptions[] = [];

  const tokenRegex = /[a-zA-Z0-9._]+/g;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text))) {
    const word = match[0];
    const startPos = document.positionAt(match.index);
    const endPos = document.positionAt(match.index + word.length);
    const range = new vscode.Range(startPos, endPos);

    if (word.startsWith('spacing.')) {
      const key = word.split('.')[1];
      const value = getSpacingValue(key);
      if (value !== undefined) {
        const option: vscode.DecorationOptions = {
          range,
          renderOptions: {
            after: {
              contentText: `${value}px`
            }
          }
        };
        spacingOptions.push(option);
      }
    } else if (isValidColorPath(word)) {
      // Check if it's a valid color path (without "color." prefix)
      const value = getColorValue(word);
      if (value) {
        if (!colorDecorations.has(value)) {
          colorDecorations.set(value, createColorDecoration(value));
        }
        const ranges = colorMatches.get(value) || [];
        ranges.push(range);
        colorMatches.set(value, ranges);
      }
    }
  }

  // Apply spacing decorations (non-replacing)
  activeEditor.setDecorations(spacingValueDecoration, spacingOptions);

  // Apply color decorations
  for (const [color, ranges] of colorMatches.entries()) {
    const decoration = colorDecorations.get(color);
    if (decoration) {
      activeEditor.setDecorations(decoration, ranges);
    }
  }
}

function parseColorToVscodeColor(colorValue: string): vscode.Color | undefined {
  // Handle HSLA format: hsla(213, 47%, 96%, 1)
  const hslaMatch = colorValue.match(/hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([\d.]+)\)/);
  if (hslaMatch) {
    const h = parseInt(hslaMatch[1] , 10 ) / 360; // VSCode expects 0-1
    const s = parseInt(hslaMatch[2] , 10) / 100; // VSCode expects 0-1  
    const l = parseInt(hslaMatch[3] , 10) / 100; // VSCode expects 0-1
    const a = parseFloat(hslaMatch[4]);
    
    // Convert HSL to RGB for VSCode Color
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;
    
    let r, g, b;
    const hue = h * 6;
    if (hue < 1) {
      [r, g, b] = [c, x, 0];
    } else if (hue < 2) {
      [r, g, b] = [x, c, 0];
    } else if (hue < 3) {
      [r, g, b] = [0, c, x];
    } else if (hue < 4) {
      [r, g, b] = [0, x, c];
    } else if (hue < 5) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }
    
    return new vscode.Color(r + m, g + m, b + m, a);
  }
  
  // Fallback: Handle hex format #rgb and #rrggbb
  if (colorValue.startsWith('#')) {
    const h = colorValue.replace('#', '');
    if (h.length === 3) {
      const r = parseInt(h[0] + h[0], 16);
      const g = parseInt(h[1] + h[1], 16);
      const b = parseInt(h[2] + h[2], 16);
      return new vscode.Color(r / 255, g / 255, b / 255, 1);
    }
    if (h.length === 6) {
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return new vscode.Color(r / 255, g / 255, b / 255, 1);
    }
  }
  
  return undefined;
}

export function activate(context: vscode.ExtensionContext) {
  // Register hover provider
  const provider: vscode.HoverProvider = {
    provideHover(document, position) {
      const range = document.getWordRangeAtPosition(position, /[a-zA-Z0-9._]+/);
      if (!range) {
        return;
      }
      const word = document.getText(range);
      if (word.startsWith('spacing.')) {
        const key = word.split('.')[1];
        const value = getSpacingValue(key);
        if (value !== undefined) {
          return new vscode.Hover(`spacing.${key} \u2192 ${value}px`);
        }
      } else if (isValidColorPath(word)) {
        const value = getColorValue(word);
        if (value) {
          return new vscode.Hover(`${word} \u2192 ${value}`);
        }
      }
      return;
    }
  };

  // Initial update
  if (activeEditor) {
    updateDecorations();
  }

  const debouncedUpdateDecorations = debounce(updateDecorations, 200);  

  // Update on active editor change
  vscode.window.onDidChangeActiveTextEditor(editor => {
    activeEditor = editor || undefined;
    if (activeEditor) {
      debouncedUpdateDecorations();
    }
  }, null, context.subscriptions);



  // Update on document changes
  vscode.workspace.onDidChangeTextDocument(event => {
    if (activeEditor && event.document === activeEditor.document) {
      debouncedUpdateDecorations();
    }
  }, null, context.subscriptions);

  // Update when selection (cursor) changes
  vscode.window.onDidChangeTextEditorSelection(() => {
    if (activeEditor) {
      debouncedUpdateDecorations(); 
    }
  }, null, context.subscriptions);

  context.subscriptions.push(
    vscode.languages.registerHoverProvider('*', provider)
  );

  // Color provider to show native VS Code color decorators for color tokens
  const colorProvider: vscode.DocumentColorProvider = {
    provideDocumentColors(document) {
      const text = document.getText();
      const tokenRegex = /[a-zA-Z0-9._]+/g;
      const infos: vscode.ColorInformation[] = [];
      let match: RegExpExecArray | null;
      while ((match = tokenRegex.exec(text))) {
        const word = match[0];
        if (!isValidColorPath(word)) continue;
        const value = getColorValue(word);
        if (!value) continue;
        const start = document.positionAt(match.index);
        const end = document.positionAt(match.index + word.length);
        const range = new vscode.Range(start, end);
        const color = parseColorToVscodeColor(value);
        if (color) {
          infos.push(new vscode.ColorInformation(range, color));
        }
      }
      return infos;
    },
    provideColorPresentations(color, context) {
      // Keep token text unchanged; show hex as label
      const tokenText = context.document.getText(context.range);
      const r = Math.round(color.red * 255);
      const g = Math.round(color.green * 255);
      const b = Math.round(color.blue * 255);
      const hex = `#${r.toString(16).padStart(2, '0')}${g
        .toString(16)
        .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      const pres = new vscode.ColorPresentation(hex);
      pres.textEdit = new vscode.TextEdit(context.range, tokenText);
      return [pres];
    }
  };

  context.subscriptions.push(
    vscode.languages.registerColorProvider('*', colorProvider)
  );
}

export function deactivate() {
  // Dispose all decorations
  colorDecorations.forEach(decoration => decoration.dispose());
  spacingValueDecoration.dispose();
}
