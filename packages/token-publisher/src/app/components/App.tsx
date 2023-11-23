import type { ReactElement } from 'react';
import React, { useState } from 'react';
import '../styles/ui.css';
// eslint-disable-next-line import/extensions
import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import { uploadTokens } from '../api/api';
import type { TokenType } from '../api/api';

const App = (): ReactElement => {
  const [themeColorTokens, setThemeColorTokens] = useState({});
  const [globalColorTokens, setGlobalColorTokens] = useState({});
  const [personalAccessToken, setPersonalAccessToken] = useState('');
  const tokenType = React.useRef<TokenType>();

  const handlePersonalAccessTokenChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPersonalAccessToken(event.target.value);
  };

  const onCreate = React.useCallback(async () => {
    await uploadTokens({
      orgName: 'razorpay',
      repoName: 'blade',
      workflowFileName: 'blade-tokens-upload.yml',
      personalAccessToken,
      colorTokens: tokenType.current === 'themeColorTokens' ? themeColorTokens : globalColorTokens,
      tokenType: tokenType.current,
    });
  }, [themeColorTokens, globalColorTokens, personalAccessToken]);

  const onCancel = React.useCallback(() => {
    // nosemgrep
    parent.postMessage({ pluginMessage: { type: 'closePlugin' } }, '*');
  }, []);

  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type, data } = event.data.pluginMessage;
      if (type === 'export-theme-color-tokens') {
        tokenType.current = 'themeColorTokens';
        setThemeColorTokens(data);
      } else if (type === 'export-global-color-tokens') {
        tokenType.current = 'globalColorTokens';
        setGlobalColorTokens(data);
      }
    };
  }, []);

  return (
    <section className="container">
      <p className="section-title">
        To publish the generated tokens to your GitHub repository, you need a personal access token.
        Don't have access token?
        <span>
          &nbsp;
          <a
            href="https://github.com/settings/tokens/new?scopes=repo,workflow,write:packages,read:repo_hook,write:packages"
            target="_blank"
            rel="noopener noreferrer"
          >
            Generate here
          </a>
        </span>
      </p>
      <label htmlFor="accesssTokenInput" className="label">
        GitHub Personal Access Token
      </label>
      <input
        id="accesssTokenInput"
        className="input__field input__field--margin"
        type="password"
        placeholder="xxxxxx"
        value={personalAccessToken}
        onChange={handlePersonalAccessTokenChange}
      />
      <section className="container__button">
        <button className="button button--primary" onClick={onCreate}>
          Export Tokens
        </button>
        <button className="button button--secondary" onClick={onCancel}>
          Cancel
        </button>
      </section>
    </section>
  );
};

export default App;
