import { Sandpack } from '@codesandbox/sandpack-react';

const CodeEditor = (): React.ReactElement => {
  return <Sandpack template="node" options={{ showConsole: true }} />;
};

export { CodeEditor };
