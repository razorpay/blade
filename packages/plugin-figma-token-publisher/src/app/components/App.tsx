import type { ReactElement, ReactNode } from 'react';
import React, { useState } from 'react';
import '../styles/ui.css';
// eslint-disable-next-line import/extensions
import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import type { ExportedIcons } from '../api/api';
import { uploadIcons, uploadTokens } from '../api/api';
import type { TokenDiff } from '../tokenDiff';
import { BASE_REF, diffAgainstBase } from '../tokenDiff';

type DiffState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; diff: TokenDiff }
  | { status: 'error'; message: string };

const countChanges = ({ added, removed, changed }: TokenDiff): number =>
  added.length + removed.length + changed.length;

/** `bladeTheme.onLight.surface.x` reads as where it lives, then which token it is. */
const splitTokenPath = (tokenPath: string): { where: string; token: string } => {
  const themeMatch = /^([^.]+)\.(onLight|onDark)\.(.+)$/.exec(tokenPath);
  if (themeMatch) {
    return { where: `${themeMatch[1]} · ${themeMatch[2]}`, token: themeMatch[3] };
  }
  const [root, ...rest] = tokenPath.split('.');
  return { where: root, token: rest.join('.') };
};

const TokenLine = ({
  tokenPath,
  children,
}: {
  tokenPath: string;
  children?: ReactNode;
}): ReactElement => {
  const { where, token } = splitTokenPath(tokenPath);
  return (
    <li className="report__item change">
      <span className="change__where">{where}</span>
      <code className="chip chip--wrap">{token}</code>
      {children}
    </li>
  );
};

const ChangeSection = ({
  title,
  tone,
  items,
}: {
  title: string;
  tone: 'info' | 'warning';
  items: ReactElement[];
}): ReactElement | null => {
  if (!items.length) return null;
  return (
    <details className={`report report--${tone}`} open>
      <summary className="report__summary">
        <span className="report__title">{title}</span>
        <span className="report__count">{items.length}</span>
      </summary>
      <ul className="report__list">{items}</ul>
    </details>
  );
};

/**
 * What the push would change on `master`, so it can be confirmed before anything is sent. A push
 * that recolours tokens changes no token path, so without this the window looked identical whether
 * the push did something or nothing.
 */
const ChangeSummary = ({ state }: { state: DiffState }): ReactElement | null => {
  if (state.status === 'idle') return null;
  if (state.status === 'loading') {
    return <p className="intro">Comparing with {BASE_REF}…</p>;
  }
  if (state.status === 'error') {
    return (
      <p className="intro">
        ⚠️ Could not compare with {BASE_REF}: {state.message}. Export still works, but the changes
        are not listed here.
      </p>
    );
  }

  const { added, removed, changed } = state.diff;
  if (!countChanges(state.diff)) {
    return (
      <p className="all-clear">
        No token changes compared with {BASE_REF}, so there is nothing to publish.
      </p>
    );
  }

  return (
    <>
      <p className="label">Changes compared with {BASE_REF}</p>
      <ChangeSection
        title="Changed"
        tone="info"
        items={changed.map((change) => (
          <TokenLine key={change.path} tokenPath={change.path}>
            <span className="change__values">
              <code className="chip chip--wrap">{change.before}</code>
              {' → '}
              <code className="chip chip--wrap">{change.after}</code>
            </span>
          </TokenLine>
        ))}
      />
      <ChangeSection
        title="Added"
        tone="info"
        items={added.map((tokenPath) => (
          <TokenLine key={tokenPath} tokenPath={tokenPath} />
        ))}
      />
      <ChangeSection
        title="Removed (breaking for anything still using them)"
        tone="warning"
        items={removed.map((tokenPath) => (
          <TokenLine key={tokenPath} tokenPath={tokenPath} />
        ))}
      />
    </>
  );
};

type TokenReport = {
  errors: string[];
  warnings: string[];
  diagnostics: string[];
};

const EMPTY_REPORT: TokenReport = { errors: [], warnings: [], diagnostics: [] };

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
  const [diffState, setDiffState] = useState<DiffState>({ status: 'idle' });
  // The icon export shares this window, but the token footer would dispatch the token workflow
  // with an empty payload.
  const isIconExport = exportedIcons.length > 0;

  const handlePersonalAccessTokenChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPersonalAccessToken(event.target.value);
  };

  // Publishing with known errors means the run either deletes tokens or writes values that throw
  // on import. Both have shipped before; neither is worth a round trip through CI to discover.
  const hasBlockingErrors = report.errors.length > 0;
  // Until the tokens arrive, `colorTokens` is the empty `{}` it started as. Publishing that is what
  // opened two token PRs with nothing in them.
  // The change list is the confirmation step, so wait for it. If GitHub cannot be reached, the
  // push still goes ahead — the PR body lists the same changes.
  const isComparing = diffState.status === 'loading';
  const hasNothingToPublish = diffState.status === 'ready' && !countChanges(diffState.diff);
  const canPublish =
    hasGeneratedTokens &&
    !hasBlockingErrors &&
    !isComparing &&
    !hasNothingToPublish &&
    personalAccessToken.length > 0;
  const reportItemCount = report.errors.length + report.warnings.length + report.diagnostics.length;

  const onCreate = React.useCallback(async () => {
    if (!canPublish) return;
    await uploadTokens({
      orgName: 'razorpay',
      repoName: 'blade',
      workflowFileName: 'blade-tokens-upload.yml',
      personalAccessToken,
      colorTokens,
    });
  }, [colorTokens, personalAccessToken, canPublish]);

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
        targets: ['react'],
      });
    } finally {
      setIsRequestingIconPr(false);
    }
  }, [exportedIcons, personalAccessToken]);

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
            ? '📋 Copied. Paste it into scripts/icons/icons.json'
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
      // the iframe also receives messages that are not from the plugin
      if (!event.data?.pluginMessage) return;
      const { type, data } = event.data.pluginMessage;
      if (type === 'export-color-tokens') {
        const { report: tokenReport, ...tokens } = data;
        setColorTokens({ ...tokens, report: tokenReport ?? EMPTY_REPORT });
        setReport(tokenReport ?? EMPTY_REPORT);
        setHasGeneratedTokens(true);

        setDiffState({ status: 'loading' });
        diffAgainstBase({
          themeColorTokens: tokens.taggedThemeColorTokens ?? tokens.themeColorTokens,
          globalColorTokens: tokens.taggedGlobalColorTokens ?? tokens.globalColorTokens,
        })
          .then((diff) => setDiffState({ status: 'ready', diff }))
          .catch((error: Error) => setDiffState({ status: 'error', message: error.message }));
      }
      if (type === 'export-svg-icons') {
        setExportedIcons(data);
      }
    };
    // The plugin holds its messages until it hears this, so it has to go out only once the
    // listener above is in place. Anything it sent earlier would have been dropped.
    // nosemgrep
    parent.postMessage({ pluginMessage: { type: 'ui-ready' } }, '*');
  }, []);

  // The plugin opens the window small. Ask for enough room to read the change list without
  // scrolling a line at a time; the plugin caps the height.
  React.useEffect(() => {
    if (isIconExport || !hasGeneratedTokens) return;
    const scroll = document.querySelector('.app__scroll');
    const footer = document.querySelector('.app__footer');
    const lastItem = scroll?.lastElementChild;
    if (!scroll || !footer || !lastItem) return;
    // The scroll area stretches to fill the window, so its own height is the window's, not the
    // content's. Measure down to the last thing in it instead.
    const contentHeight =
      lastItem.getBoundingClientRect().bottom -
      scroll.getBoundingClientRect().top +
      scroll.scrollTop +
      (parseFloat(getComputedStyle(scroll).paddingBottom) || 0);
    // nosemgrep
    parent.postMessage(
      {
        pluginMessage: {
          type: 'resize',
          height: Math.ceil(contentHeight + footer.getBoundingClientRect().height),
        },
      },
      '*',
    );
  }, [diffState, report, hasGeneratedTokens, isIconExport]);

  if (isIconExport) {
    return (
      <main className="app">
        <div className="app__scroll">
          <p className="intro">
            Opens a PR on razorpay/blade that generates these icons and checks them. Icons that
            already match Blade are left out of it. Needs a GitHub personal access token.{' '}
            {accessTokenLink}
          </p>
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
              title="Copy the icons for scripts/icons/icons.json and yarn generate-icons"
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
        <p className="intro">Publishing needs a GitHub personal access token. {accessTokenLink}</p>

        {hasGeneratedTokens ? null : (
          <p className="intro">
            Reading tokens from Figma… Export stays disabled until they arrive. If this does not
            change, close the plugin and run it again.
          </p>
        )}

        <ReportSection
          title="Fix before publishing"
          tone="error"
          items={report.errors}
          defaultOpen
        />
        <ChangeSummary state={diffState} />
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
              !hasGeneratedTokens
                ? 'Waiting for the tokens from Figma.'
                : hasBlockingErrors
                ? 'Resolve the errors above in Figma, then run the plugin again.'
                : isComparing
                ? `Comparing with ${BASE_REF}.`
                : hasNothingToPublish
                ? `Nothing to publish: the tokens match ${BASE_REF}.`
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
