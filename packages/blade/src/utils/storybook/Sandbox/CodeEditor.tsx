import { SandpackCodeEditor, useSandpack } from '@codesandbox/sandpack-react';

import { EventEmitter } from '@okikio/emitter';
import { memo, useEffect, useRef } from 'react';
import { codemirrorTypescriptExtensions } from './codemirror-extensions';

export const CodeEditor: React.FC<{ activePath?: string }> = memo(({ activePath }) => {
  const tsServer = useRef(
    new Worker(new URL('/workers/tsserver.js', window.location.origin), {
      name: 'ts-server',
    }),
  );
  const emitter = useRef(new EventEmitter());
  const { sandpack } = useSandpack();

  useEffect(function listener() {
    const serverMessageCallback = ({
      data: { event, details },
    }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MessageEvent<{ event: string; details: any }>): void => {
      emitter.current.emit(event, details);
    };

    tsServer.current.addEventListener('message', serverMessageCallback);

    return () => {
      tsServer.current.removeEventListener('message', serverMessageCallback);
    };
  }, []);

  useEffect(function init() {
    emitter.current.on('ready', () => {
      const getTypescriptCache = (): Map<string, string> => {
        const cache = new Map();
        const keys = Object.keys(localStorage);

        keys.forEach((key) => {
          if (key.startsWith('ts-lib-')) {
            cache.set(key, localStorage.getItem(key));
          }
        });

        return cache;
      };

      tsServer.current.postMessage({
        event: 'create-system',
        details: {
          files: sandpack.files,
          // @ts-expect-error: activePath does exist
          entry: sandpack.activePath,
          fsMapCached: getTypescriptCache(),
        },
      });
    });

    emitter.current.on(
      'cache-typescript-fsmap',
      ({ version, fsMap }: { version: string; fsMap: Map<string, string> }) => {
        fsMap.forEach((file, lib) => {
          const cacheKey = `ts-lib-${version}-${lib}`;
          localStorage.setItem(cacheKey, file);
        });
      },
    );
  }, []);

  const extensions = codemirrorTypescriptExtensions(tsServer.current, emitter.current, activePath);

  return <SandpackCodeEditor showTabs extensions={extensions} />;
});
