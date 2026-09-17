import type { ReactElement, ReactNode } from 'react';
import React, { useState } from 'react';
import '../styles/ui.css';
// eslint-disable-next-line import/extensions
import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import { uploadTokens } from '../api/api';

type TokenReport = {
  errors: string[];
  warnings: string[];
  diagnostics: string[];
};

const EMPTY_REPORT: TokenReport = { errors: [], warnings: [], diagnostics: [] };

/**
 * Report messages carry token paths in backticks. Rendering them as text puts a wall of punctuation
 * in front of the reader; as chips, the path is the thing the eye lands on.
 */
const withCodeChips = (message: string): ReactNode[] =>
  message.split(/`([^`]+)`/g).map((part, index) =>
    index % 2 ? (
      // eslint-disable-next-line react/no-array-index-key
      <code key={index} className="chip">
        {part}
      </code>
    ) : (
      part
    ),
  );

const ReportSection = ({
  title,
  tone,
  items,
  defaultOpen,
}: {
  title: string;
  tone: 'error' | 'warning' | 'info';
  items: string[];
  defaultOpen: boolean;
}): ReactElement | null => {
  if (!items.length) return null;

  return (
    <details className={`report report--${tone}`} open={defaultOpen}>
      <summary className="report__summary">
        <span className="report__title">{title}</span>
        <span className="report__count">{items.length}</span>
      </summary>
      <ul className="report__list">
        {items.map((item) => (
          <li key={item} className="report__item">
            {withCodeChips(item)}
          </li>
        ))}
      </ul>
    </details>
  );
};

const App = (): ReactElement => {
  const [colorTokens, setColorTokens] = useState({});
  const [report, setReport] = useState<TokenReport>(EMPTY_REPORT);
  // A clean run and a run that has not happened yet both have an empty report, but only one of
  // them should say so.
  const [hasGeneratedTokens, setHasGeneratedTokens] = useState(false);
  const [personalAccessToken, setPersonalAccessToken] = useState('');
  const [svgString, setSvgString] = React.useState('');

  const handlePersonalAccessTokenChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPersonalAccessToken(event.target.value);
  };

  // Publishing with known errors means the run either deletes tokens or writes values that throw
  // on import. Both have shipped before; neither is worth a round trip through CI to discover.
  const hasBlockingErrors = report.errors.length > 0;
  const canPublish = !hasBlockingErrors && personalAccessToken.length > 0;
  const reportItemCount = report.errors.length + report.warnings.length + report.diagnostics.length;

  const onCreate = React.useCallback(async () => {
    if (hasBlockingErrors) return;
    await uploadTokens({
      orgName: 'razorpay',
      repoName: 'blade',
      workflowFileName: 'blade-tokens-upload.yml',
      personalAccessToken,
      colorTokens,
    });
  }, [colorTokens, personalAccessToken, hasBlockingErrors]);

  const onCancel = React.useCallback(() => {
    // nosemgrep
    parent.postMessage({ pluginMessage: { type: 'closePlugin' } }, '*');
  }, []);

  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type, data } = event.data.pluginMessage;
      if (type === 'export-color-tokens') {
        const { report: tokenReport, ...tokens } = data;
        setColorTokens({ ...tokens, report: tokenReport ?? EMPTY_REPORT });
        setReport(tokenReport ?? EMPTY_REPORT);
        setHasGeneratedTokens(true);
      }
      if (type === 'export-svg-icons') {
        const svg = data;
        console.log(data);
        setSvgString(JSON.stringify(svg, null, 2));
      }
    };
  }, []);

  return (
    <main className="app">
      <div className="app__scroll">
        <p className="intro">
          Publishing needs a GitHub personal access token.{' '}
          <a
            href="https://github.com/settings/tokens/new?scopes=repo,workflow,write:packages,read:repo_hook,write:packages"
            target="_blank"
            rel="noopener noreferrer"
          >
            Generate one
          </a>
        </p>

        <ReportSection
          title="Fix before publishing"
          tone="error"
          items={report.errors}
          defaultOpen
        />
        <ReportSection
          title="Worth checking"
          tone="warning"
          items={report.warnings}
          defaultOpen={!hasBlockingErrors}
        />
        <ReportSection title="Notes" tone="info" items={report.diagnostics} defaultOpen={false} />

        {hasGeneratedTokens && !reportItemCount ? (
          <p className="all-clear">✅ Tokens generated, nothing flagged.</p>
        ) : null}

        {svgString ? (
          <>
            <label htmlFor="exportedIcons" className="label">
              Exported icons
            </label>
            <textarea id="exportedIcons" className="input__field" value={svgString} readOnly />
          </>
        ) : null}
      </div>

      <footer className="app__footer">
        <label htmlFor="accesssTokenInput" className="label">
          GitHub personal access token
        </label>
        <input
          id="accesssTokenInput"
          className="input__field"
          type="password"
          placeholder="xxxxxx"
          value={personalAccessToken}
          onChange={handlePersonalAccessTokenChange}
        />
        <div className="app__actions">
          <button className="button button--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="button button--primary"
            onClick={onCreate}
            disabled={!canPublish}
            title={
              hasBlockingErrors
                ? 'Resolve the errors above in Figma, then run the plugin again.'
                : undefined
            }
          >
            Export tokens
          </button>
        </div>
      </footer>
    </main>
  );
};

export default App;
