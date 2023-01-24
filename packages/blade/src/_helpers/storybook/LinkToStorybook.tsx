// Taken from:
// https://github.com/storybookjs/storybook/blob/main/addons/links/src/react/components/link.tsx
import React from 'react';
import { hrefTo, navigate } from '@storybook/addon-links';
import { Link } from '~components/Link';

// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const LEFT_BUTTON = 0;
const isPlainLeftClick = (e: React.MouseEvent<HTMLAnchorElement>): boolean =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const cancelled = (e: React.MouseEvent<HTMLAnchorElement>, cb = (_e: unknown) => {}): void => {
  if (isPlainLeftClick(e)) {
    e.preventDefault();
    cb(e);
  }
};

const LinkToStorybook = ({
  kind,
  story,
  children,
}: {
  kind: string;
  story: string;
  children: string;
}): React.ReactElement => {
  const [href, setHref] = React.useState('');

  const updateHref = async (): Promise<void> => {
    const href = await hrefTo(kind, story);
    setHref(href);
  };

  const handleClick = (): void => {
    navigate({ kind, story });
  };

  React.useEffect(() => {
    void updateHref();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, story]);

  return (
    // eslint-disable-next-line
    <Link href={href} onClick={(e) => cancelled(e as any, handleClick)}>
      {children}
    </Link>
  );
};

export { LinkToStorybook };
