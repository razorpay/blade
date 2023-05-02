import type { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import copy from 'clipboard-copy';
import { useToast } from '../../providers/Toast';
import Prism from './prism';
import './prism.css';
import classNames from './CodePreview.module.css';

interface CodePreviewProps {
  content: string;
}

export const CodePreview: FunctionComponent<CodePreviewProps> = ({ content }) => {
  const showToast = useToast();

  const handleCopyClicked = async (): Promise<void> => {
    await copy(content);
    showToast('✅ Copied to clipboard');
  };

  const highlighted = useMemo(
    // @ts-expect-error Prism is not typed
    () => Prism.highlight(content, Prism.languages.jsx, 'jsx'),
    [content],
  );

  return (
    <article className={classNames.Container}>
      <pre className={`${classNames.Pre} "language-jsx"`}>
        <button className={`${classNames.CopyButton} button`} onClick={handleCopyClicked}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={classNames.Icon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
            />
          </svg>
        </button>
        <code className="language-jsx" dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </article>
  );
};
