import React, { useEffect, useRef } from 'react';
import { MemoryRouter, Route, matchPath, useHistory, useLocation } from 'react-router-dom';
import type { MemoryRouterProps } from 'react-router-dom';
import { action } from 'storybook/actions';
import type { Decorator } from '@storybook/react-vite';

type Links = Record<string, (path: string) => void>;

const LocationLogger = ({ links }: { links?: Links }): null => {
  const location = useLocation();
  const history = useHistory();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    return history.listen((loc, historyAction) => {
      const path = loc.pathname;
      if (path === prevPathRef.current) return;
      prevPathRef.current = path;

      if (links) {
        for (const link of Object.keys(links)) {
          if (matchPath(path, { path: link, exact: true })) {
            links[link](path);
            return;
          }
        }
      }

      action(historyAction ?? 'POP')(path);
    });
  }, [history, links]);

  return null;
};

const storyRouterDecorator = (links?: Links, routerProps?: MemoryRouterProps): Decorator => {
  const decorator: Decorator = (Story) => (
    <MemoryRouter {...routerProps}>
      <LocationLogger links={links} />
      <Route render={() => <Story />} />
    </MemoryRouter>
  );
  // eslint-disable-next-line no-restricted-properties
  decorator.displayName = 'StoryRouter';
  return decorator;
};

export default storyRouterDecorator;
