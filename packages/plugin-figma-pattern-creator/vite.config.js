import { resolve } from 'path';
import { defineConfig } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'fs';

// Custom plugin to handle Figma plugin files
function figmaPlugin() {
  return {
    name: 'figma-plugin',
    writeBundle() {
      // Inline CSS and inject component keys into HTML for Figma plugin compatibility
      try {
        const distDir = resolve(__dirname, 'dist');
        const previewAssetsSrc = resolve(__dirname, 'src/assets/pattern-previews');
        const previewAssetsDist = resolve(distDir, 'assets/pattern-previews');

        // Ensure dist directory exists
        mkdirSync(distDir, { recursive: true });
        if (existsSync(previewAssetsSrc)) {
          mkdirSync(resolve(distDir, 'assets'), { recursive: true });
          cpSync(previewAssetsSrc, previewAssetsDist, { recursive: true });
        }

        // Read the source files
        const htmlContent = readFileSync(resolve(__dirname, 'src/ui.html'), 'utf-8');
        const cssContent = readFileSync(resolve(__dirname, 'src/ui.css'), 'utf-8');
        const componentKeysContent = readFileSync(
          resolve(__dirname, 'src/componentKeys.ts'),
          'utf-8',
        );
        const previewImagesContent = readFileSync(
          resolve(__dirname, 'src/previewImages.ts'),
          'utf-8',
        );

        // Extract the data from componentKeys.ts and previewImages.ts
        // Find DEFAULT_UI_PATTERNS export from componentKeys.ts
        const patternsMatch = componentKeysContent.match(
          /export const DEFAULT_UI_PATTERNS[^=]*=\s*(\[[\s\S]*?\]);/,
        );
        // Find PREVIEW_IMAGE_MAPPINGS export from previewImages.ts
        const previewMatch = previewImagesContent.match(
          /export const PREVIEW_IMAGE_MAPPINGS[^=]*=\s*(\{[\s\S]*?\});/,
        );

        if (!patternsMatch || !previewMatch) {
          throw new Error('Could not extract data from componentKeys.ts or previewImages.ts');
        }

        const patternsData = patternsMatch[1];
        const previewData = previewMatch[1];

        // Create the JavaScript injection
        const componentKeysScript = `
  <script>
    // Component Key Mappings (injected from componentKeys.ts at build time)
    
    // ========================================
    // DEFAULT UI PATTERNS
    // ========================================
    window.DEFAULT_UI_PATTERNS = ${patternsData};
    
    // ========================================
    // PREVIEW IMAGE MAPPINGS
    // ========================================
    window.PREVIEW_IMAGE_MAPPINGS = ${previewData};
  </script>`;

        // Read the built UI script
        let uiScript = '';
        try {
          const uiScriptPath = resolve(distDir, 'ui.js');
          const uiScriptContent = readFileSync(uiScriptPath, 'utf-8');
          uiScript = `\n  <script>\n${uiScriptContent}\n  </script>`;
        } catch (error) {
          console.warn('UI script not found, skipping...');
        }

        // Replace placeholders with actual content
        let processedHtml = htmlContent
          .replace('<link rel="stylesheet" href="ui.css">', `<style>\n${cssContent}\n  </style>`)
          .replace(
            '  <!-- Component keys will be injected here at build time -->',
            componentKeysScript,
          )
          .replace('<script src="ui.js"></script>', uiScript);

        // Write the final HTML file
        writeFileSync(resolve(distDir, 'ui.html'), processedHtml);

        console.log('✓ Inlined CSS and injected component keys into ui.html');
      } catch (error) {
        console.warn('Could not process files:', error.message);
        console.error(error);
      }
    },
  };
}

export default defineConfig({
  build: {
    outDir: 'dist',
    target: 'es2018',
    rollupOptions: {
      input: {
        code: resolve(__dirname, 'src/code.ts'),
        'code.basic': resolve(__dirname, 'src/code.basic.ts'),
        ui: resolve(__dirname, 'src/ui/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'code') return 'code.js';
          if (chunkInfo.name === 'code.basic') return 'code.basic.js';
          if (chunkInfo.name === 'ui') return 'ui.js';
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'icon.png') {
            return 'assets/icon.png';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },
  plugins: [figmaPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/componentKeys'),
    },
  },
});
