/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
/* eslint-disable import/no-extraneous-dependencies */
import type { EventEmitter } from '@okikio/emitter';
import type { ViewUpdate } from '@codemirror/view';
import { EditorView } from '@codemirror/view';
import type { CompletionContext, CompletionResult, Completion } from '@codemirror/autocomplete';
import { autocompletion, completeFromList } from '@codemirror/autocomplete';
import type { Tooltip } from '@codemirror/tooltip';
import { hoverTooltip } from '@codemirror/tooltip';
import type { Diagnostic } from '@codemirror/lint';
import { linter } from '@codemirror/lint';

import debounce from 'lodash/debounce';
import debounceAsync from 'debounce-async';

export const codemirrorTypescriptExtensions = (
  tsServer: Worker,
  emitter: EventEmitter,
  filePath?: string,
): any => [
  EditorView.updateListener.of(
    debounce((update: ViewUpdate) => {
      tsServer.postMessage({
        event: 'updateText',
        details: {
          filePath,
          content: update.state.doc.text.join('\n'),
        },
      });
    }, 150),
  ),

  autocompletion({
    activateOnTyping: true,
    override: [
      debounceAsync(async (ctx: CompletionContext): Promise<CompletionResult | null> => {
        const { pos } = ctx;

        try {
          tsServer.postMessage({
            event: 'autocomplete-request',
            details: { pos, filePath },
          });

          const completions = await new Promise((resolve) => {
            emitter.on('autocomplete-results', (completions) => {
              resolve(completions);
            });
          });

          if (!completions) {
            console.log('Unable to get completions', { pos });
            return null;
          }

          return await completeFromList(
            // @ts-ignore
            completions.entries.map((c, _i) => {
              const suggestions: Completion = {
                type: c.kind,
                label: c.name,
                // TODO:: populate details and info
                boost: 1 / Number(c.sortText),
              };

              return suggestions;
            }),
          )(ctx);
        } catch (e: unknown) {
          console.log('Unable to get completions', { pos, error: e });
          return null;
        }
      }, 200),
    ],
  }),

  hoverTooltip(
    async (_: EditorView, pos: number): Promise<Tooltip | null> => {
      tsServer.postMessage({
        event: 'tooltip-request',
        details: { pos, filePath },
      });

      const { result: quickInfo, tootltipText } = await new Promise((resolve) => {
        emitter.on('tooltip-results', (completions) => {
          resolve(completions);
        });
      });

      if (!quickInfo) return null;

      return {
        pos,
        create() {
          const dom = document.createElement('div');
          dom.setAttribute('class', 'quickinfo-tooltip');
          dom.textContent = tootltipText;

          return { dom };
        },
      };
    },
    { hideOnChange: true },
  ),

  linter(
    async (): Promise<Diagnostic[]> => {
      tsServer.postMessage({
        event: 'lint-request',
        details: { filePath },
      });

      const diagnostics = await new Promise((resolve) => {
        emitter.once('lint-results', (completions) => {
          resolve(completions);
        });
      });

      return diagnostics ? diagnostics : [];
    },
    { delay: 400 },
  ),
  EditorView.baseTheme({
    '.quickinfo-tooltip': {
      padding: '6px 3px 6px 8px',
      marginLeft: '-1px',
      borderLeft: '5px solid #999',
    },
  }),
];
