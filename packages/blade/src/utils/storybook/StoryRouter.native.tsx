import React from 'react';
import type { MemoryRouterProps } from 'react-router-dom';
import type { Decorator } from '@storybook/react-vite';

type Links = Record<string, (path: string) => void>;

/**
 * Native no-op version of the StoryRouter decorator.
 *
 * `react-router-dom` relies on `path-to-regexp`, which compiles route patterns
 * into regular expressions that Hermes rejects ("Invalid RegExp: Invalid
 * escape"), crashing the RN Storybook bundle. Routing-driven story demos are
 * web-only, so on native we simply render the story without any router context.
 */
const storyRouterDecorator = (_links?: Links, _routerProps?: MemoryRouterProps): Decorator => {
  const decorator: Decorator = (Story) => <Story />;
  // eslint-disable-next-line no-restricted-properties
  decorator.displayName = 'StoryRouter';
  return decorator;
};

export default storyRouterDecorator;
