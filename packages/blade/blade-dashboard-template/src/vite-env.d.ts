/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  import * as React from 'react';
  const src: string;
  export default src;
}

declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

