import { useState, useEffect } from 'preact/hooks';
import type { FunctionComponent } from 'preact';
import { CodePreview } from './components/CodePreview/CodePreview';
import { ToastProvider } from './providers/Toast';
import { ToastManager } from './components/ToastManager/ToastManager';
import type { Message, Result } from '~/types/MessageTypes';

const emptyPlaceholder: Result = {
  component: 'Empty',
  imports: 'Empty',
};

export const App: FunctionComponent = () => {
  const [code, setCode] = useState<Result>(emptyPlaceholder);

  useEffect(() => {
    onmessage = (event: Message) => {
      if (!event.data.pluginMessage) {
        return;
      }

      if (event.data.pluginMessage.type === 'empty') {
        setCode(emptyPlaceholder);
      }

      if (event.data.pluginMessage.type === 'result') {
        const { component, imports } = event.data.pluginMessage;
        setCode({ component, imports });
      }
    };
  }, []);

  return (
    <ToastProvider>
      <section>
        <CodePreview content={code.imports} />
        <CodePreview content={code.component} />
      </section>
      {/* <Preferences /> */}
      <ToastManager />
    </ToastProvider>
  );
};
