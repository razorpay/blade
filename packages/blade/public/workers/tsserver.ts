/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/consistent-type-imports */
// @ts-nocheck
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { VirtualTypeScriptEnvironment } from '@typescript/vfs';
import { CompilerOptions } from 'typescript';

enum ModuleResolutionKind {
  Classic = 1,
  NodeJs = 2,
}

importScripts('https://unpkg.com/@typescript/vfs@1.3.5/dist/vfs.globals.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/typescript/4.4.3/typescript.min.js');
importScripts('https://unpkg.com/@okikio/emitter@2.1.7/lib/api.js');

export type VFS = typeof import('@typescript/vfs');
export type EVENT_EMITTER = import('@okikio/emitter').EventEmitter;
export type Diagnostic = import('@codemirror/lint').Diagnostic;

var {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} = globalThis.tsvfs as VFS;
var ts = globalThis.ts; // as TS

var EventEmitter = globalThis.emitter.EventEmitter;
var _emitter: EVENT_EMITTER = new EventEmitter();

globalThis.localStorage = globalThis.localStorage ?? ({} as Storage);

const BUCKET_URL = 'https://prod-packager-packages.codesandbox.io/v1/typings';
const TYPES_REGISTRY = 'https://unpkg.com/types-registry@latest/index.json';

/**
 * Fetch dependencies types from CodeSandbox CDN
 */
const fetchDependencyTyping = async ({
  name,
  version,
}: {
  name: string;
  version: string;
}): Promise<Record<string, { module: { code: string } }>> => {
  try {
    const url = `${BUCKET_URL}/${name}/${version}.json`;
    const { files } = await fetch(url).then((data) => data.json());

    return files;
  } catch {}
};

/**
 * Process the TS compile options or default to
 */
const getCompileOptions = (tsconfigFile: Record<string, any>): CompilerOptions => {
  const defaultValue = {
    target: ts.ScriptTarget.ES2021,
    module: ts.ScriptTarget.ES2020,
    lib: ['es2021', 'es2020', 'dom', 'webworker'],
    esModuleInterop: true,
  };

  if (tsconfigFile.compilerOptions) {
    const { compilerOptions } = tsconfigFile;
    // Hard fixes
    if (compilerOptions.moduleResolution === 'node') {
      compilerOptions.moduleResolution = ModuleResolutionKind.NodeJs;
    }

    return compilerOptions;
  }

  return defaultValue;
};

const processTypescriptCacheFromStorage = (
  fsMapCached: Map<string, string>,
): Map<string, string> => {
  const cache = new Map();
  const matchVersion = Array.from(fsMapCached.keys()).every((file) =>
    file.startsWith(`ts-lib-${ts.version}`),
  );

  if (!matchVersion) cache;

  fsMapCached.forEach((value, key) => {
    const cleanLibName = key.replace(`ts-lib-${ts.version}-`, '');
    cache.set(cleanLibName, value);
  });

  return cache;
};

const isValidTypeModule = (key: string, value?: { module: { code: string } }) =>
  key.endsWith('.d.ts') || (key.endsWith('/package.json') && value?.module?.code);

/**
 * Main worker function
 */
(async function lspTypescriptWorker() {
  let env: VirtualTypeScriptEnvironment;

  postMessage({
    event: 'ready',
    details: [],
  });

  const createTsSystem = async (
    files: Record<string, { code: string }>,
    entry: string,
    fsMapCached: Map<string, string>,
  ) => {
    const tsFiles = new Map();
    const rootPaths = [];
    const dependenciesMap = new Map();
    let tsconfig = null;
    let packageJson = null;
    let typeVersionsFromRegistry: Record<string, { latest: string }>;

    /**
     * Collect files
     */
    for (const filePath in files) {
      const content = files[filePath].code;

      // TODO: normalize path
      if (filePath === 'tsconfig.json' || filePath === '/tsconfig.json') {
        tsconfig = content;
      } else if (filePath === 'package.json' || filePath === '/package.json') {
        packageJson = content;
      } else if (/^[^.]+.tsx?$/.test(filePath)) {
        // Only ts files
        tsFiles.set(filePath, content);
        rootPaths.push(filePath);
      }
    }

    const compilerOpts = getCompileOptions(JSON.parse(tsconfig));

    /**
     * Process cache or get a fresh one
     */
    let fsMap = processTypescriptCacheFromStorage(fsMapCached);
    if (fsMap.size === 0) {
      fsMap = await createDefaultMapFromCDN(compilerOpts, ts.version, false, ts);
    }

    /**
     * Post CDN payload to cache in the browser storage
     */
    postMessage({
      event: 'cache-typescript-fsmap',
      details: { fsMap, version: ts.version },
    });

    /**
     * Add local files to the file-system
     */
    tsFiles.forEach((content, filePath) => {
      fsMap.set(filePath, content);
    });

    /**
     * Get dependencies from package.json
     */
    const { dependencies, devDependencies } = JSON.parse(packageJson);
    for (const dep in devDependencies ?? {}) {
      dependenciesMap.set(dep, devDependencies[dep]);
    }

    for (const dep in dependencies ?? {}) {
      // Avoid redundant requests
      if (!dependenciesMap.has(`@types/${dep}`)) {
        dependenciesMap.set(dep, dependencies[dep]);
      }
    }

    /**
     * Fetch dependencies types
     */
    dependenciesMap.forEach(async (version, name) => {
      // 1. CodeSandbox CDN
      const files = await fetchDependencyTyping({ name, version });
      const hasTypes = Object.keys(files).some(
        (key) => key.startsWith('/' + name) && key.endsWith('.d.ts'),
      );

      // 2. Types found
      if (hasTypes) {
        Object.entries(files).forEach(([key, value]) => {
          if (isValidTypeModule(key, value)) {
            fsMap.set(`/node_modules${key}`, value.module.code);
          }
        });

        return;
      }

      // 3. Types found: fetch types version from registry
      if (!typeVersionsFromRegistry) {
        typeVersionsFromRegistry = await fetch(TYPES_REGISTRY)
          .then((data) => data.json())
          .then((data) => data.entries);
      }

      // 4. Types found: no Look for types in @types register
      const typingName = `@types/${name}`;
      if (typeVersionsFromRegistry[name]) {
        const atTypeFiles = await fetchDependencyTyping({
          name: typingName,
          version: typeVersionsFromRegistry[name].latest,
        });

        Object.entries(atTypeFiles).forEach(([key, value]) => {
          if (isValidTypeModule(key, value)) {
            fsMap.set(`/node_modules${key}`, value.module.code);
          }
        });
      }
    });

    const system = createSystem(fsMap);

    env = createVirtualTypeScriptEnvironment(system, rootPaths, ts, compilerOpts);

    lintSystem(entry);
  };

  const updateFile = (filePath: string, content: string) => {
    env.updateFile(filePath, content);
  };

  const autocompleteAtPosition = (pos: number, filePath: string) => {
    let result = env.languageService.getCompletionsAtPosition(filePath, pos, {});

    postMessage({
      event: 'autocomplete-results',
      details: result,
    });
  };

  const infoAtPosition = (pos: number, filePath: string) => {
    let result = env.languageService.getQuickInfoAtPosition(filePath, pos);

    postMessage({
      event: 'tooltip-results',
      details: result
        ? {
            result,
            tootltipText:
              ts.displayPartsToString(result.displayParts) +
              (result.documentation?.length
                ? '\n' + ts.displayPartsToString(result.documentation)
                : ''),
          }
        : { result, tooltipText: '' },
    });
  };

  const lintSystem = (filePath: string) => {
    if (!env) return;

    let SyntacticDiagnostics = env.languageService.getSyntacticDiagnostics(filePath);
    let SemanticDiagnostic = env.languageService.getSemanticDiagnostics(filePath);
    let SuggestionDiagnostics = env.languageService.getSuggestionDiagnostics(filePath);

    type Diagnostics = typeof SyntacticDiagnostics &
      typeof SemanticDiagnostic &
      typeof SuggestionDiagnostics;
    let result: Diagnostics = [].concat(
      SyntacticDiagnostics,
      SemanticDiagnostic,
      SuggestionDiagnostics,
    );

    postMessage({
      event: 'lint-results',
      details: result.reduce((acc, result) => {
        const from = result.start;
        const to = result.start + result.length;
        // const codeActions = env.languageService.getCodeFixesAtPosition(
        //   filePath,
        //   from,
        //   to,
        //   [result.category],
        //   {},
        //   {}
        // );

        type ErrorMessageObj = {
          messageText: string;
          next?: ErrorMessageObj[];
        };
        type ErrorMessage = ErrorMessageObj | string;

        const messagesErrors = (message: ErrorMessage): string[] => {
          if (typeof message === 'string') return [message];

          const messageList = [];
          const getMessage = (loop: ErrorMessageObj) => {
            messageList.push(loop.messageText);

            if (loop.next) {
              loop.next.forEach((item) => {
                getMessage(item);
              });
            }
          };

          getMessage(message);

          return messageList;
        };

        const severity: Diagnostic['severity'][] = ['warning', 'error', 'info', 'info'];

        messagesErrors(result.messageText).forEach((message) => {
          acc.push({
            from,
            to,
            message,
            source: result?.source,
            severity: severity[result.category],
            // actions: codeActions as any as Diagnostic["actions"]
          });
        });

        return acc;
      }, [] as Diagnostic[]),
    });
  };

  /**
   * Listeners
   */
  _emitter.once(
    'create-system',
    async (payload: {
      files: Record<string, { code: string }>;
      entry: string;
      fsMapCached: Map<string, string>;
    }) => {
      createTsSystem(payload.files, payload.entry, payload.fsMapCached);
    },
  );
  _emitter.on('lint-request', (payload: { filePath: string }) => lintSystem(payload.filePath));
  _emitter.on('updateText', (payload: { filePath: string; content: string }) =>
    updateFile(payload.filePath, payload.content),
  );
  _emitter.on('autocomplete-request', (payload: { pos: number; filePath: string }) => {
    autocompleteAtPosition(payload.pos, payload.filePath);
  });
  _emitter.on('tooltip-request', (payload: { pos: number; filePath: string }) => {
    infoAtPosition(payload.pos, payload.filePath);
  });
})();

addEventListener('message', ({ data }: MessageEvent<{ event: string; details: any }>) => {
  let { event, details } = data;
  _emitter.emit(event, details);
});
