import type { ReactElement, ReactNode } from 'react';
import React, { useState } from 'react';
import '../styles/ui.css';
// eslint-disable-next-line import/extensions
import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import type { ExportedIcons, IconTarget } from '../api/api';
import { uploadIcons, uploadTokens } from '../api/api';

type TokenReport = {
  errors: string[];
  warnings: string[];
  diagnostics: string[];
};

const EMPTY_REPORT: TokenReport = { errors: [], warnings: [], diagnostics: [] };

const ICON_TARGET_OPTIONS: { id: string; label: string; targets: IconTarget[] }[] = [
  { id: 'react', label: 'React (web + native)', targets: ['react'] },
  { id: 'svelte', label: 'Svelte', targets: ['svelte'] },
  { id: 'both', label: 'Both', targets: ['react', 'svelte'] },
];

/**
 * Preview of the name `plopfile.js` gives the component (lodash `startCase`, spaces removed). The
 * workflow computes the real one; this only has to be close enough to catch a badly named layer.
 */
const toComponentName = (iconName: string): string => {
  const words = iconName.match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|[0-9]+/g) ?? [];
  return `${words.map((word) => word[0].toUpperCase() + word.slice(1)).join('')}Icon`;
};

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
  const [exportedIcons, setExportedIcons] = useState<ExportedIcons>([]);
  const [isRequestingIconPr, setIsRequestingIconPr] = useState(false);
  const [iconTargetOptionId, setIconTargetOptionId] = useState(ICON_TARGET_OPTIONS[0].id);
  // The icon export shares this window, but the token footer would dispatch the token workflow
  // with an empty payload.
  const isIconExport = exportedIcons.length > 0;

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

  const onCreateIconPr = React.useCallback(async () => {
    setIsRequestingIconPr(true);
    try {
      await uploadIcons({
        orgName: 'razorpay',
        repoName: 'blade',
        workflowFileName: 'blade-icons-upload.yml',
        personalAccessToken,
        icons: exportedIcons,
        targets:
          ICON_TARGET_OPTIONS.find((option) => option.id === iconTargetOptionId)?.targets ??
          ICON_TARGET_OPTIONS[0].targets,
      });
    } finally {
      setIsRequestingIconPr(false);
    }
  }, [exportedIcons, personalAccessToken, iconTargetOptionId]);

  const onCopyIcons = React.useCallback(() => {
    // Figma's plugin iframe does not grant the async Clipboard API.
    const textarea = document.createElement('textarea');
    textarea.value = JSON.stringify(exportedIcons, null, 2);
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    // nosemgrep
    parent.postMessage(
      {
        pluginMessage: {
          type: 'information',
          text: copied
            ? '📋 Copied. Paste it into packages/blade/scripts/icons.json'
            : '⛔️ Could not copy the icons',
        },
      },
      '*',
    );
  }, [exportedIcons]);

  const accessTokenField = (
    <>
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
    </>
  );

  const accessTokenLink = (
    <a
      href="https://github.com/settings/tokens/new?scopes=repo,workflow,write:packages,read:repo_hook,write:packages"
      target="_blank"
      rel="noopener noreferrer"
    >
      Generate one
    </a>
  );

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
        setExportedIcons(data);
      }
    };
  }, []);

  if (isIconExport) {
    return (
      <main className="app">
        <div className="app__scroll">
          <p className="intro">
            Opens a PR on razorpay/blade that generates these icons and checks them. Icons that
            already match Blade are left out of it. Needs a GitHub personal access token.{' '}
            {accessTokenLink}
          </p>
          <fieldset className="target-picker">
            <legend className="label">Raise for</legend>
            {ICON_TARGET_OPTIONS.map((option) => (
              <div key={option.id} className="radio">
                <input
                  id={`icon-target-${option.id}`}
                  className="radio__button"
                  type="radio"
                  name="icon-target"
                  value={option.id}
                  checked={iconTargetOptionId === option.id}
                  onChange={() => setIconTargetOptionId(option.id)}
                />
                <label htmlFor={`icon-target-${option.id}`} className="radio__label">
                  {option.label}
                </label>
              </div>
            ))}
          </fieldset>
          <p className="label">Components ({exportedIcons.length})</p>
          <ul className="icon-list">
            {exportedIcons.map((icon) => {
              const iconName = Object.keys(icon)[0];
              return (
                <li key={iconName} title={iconName}>
                  <code className="chip">{toComponentName(iconName)}</code>
                </li>
              );
            })}
          </ul>
        </div>

        <footer className="app__footer">
          {accessTokenField}
          <div className="app__actions">
            <button className="button button--secondary" onClick={onCancel}>
              Close
            </button>
            <button
              className="button button--secondary"
              onClick={onCopyIcons}
              title="Copy the icons for packages/blade/scripts/icons.json and yarn generate-icons"
            >
              Copy JSON
            </button>
            <button
              className="button button--primary"
              onClick={onCreateIconPr}
              disabled={!personalAccessToken || isRequestingIconPr}
            >
              {isRequestingIconPr ? 'Requesting…' : 'Create PR'}
            </button>
          </div>
        </footer>
      </main>
    );
  }

  return (
    <main className="app">
      <div className="app__scroll">
        <p className="intro">
          Publishing needs a GitHub personal access token. {accessTokenLink}
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
      </div>

      <footer className="app__footer">
        {accessTokenField}
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
