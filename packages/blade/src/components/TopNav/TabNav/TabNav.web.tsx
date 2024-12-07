/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
import React from 'react';
import ReactDOM from 'react-dom';
import { TabNavContext } from './TabNavContext';
import { useResize } from './utils';
import type { TabNavItemData, TabNavProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { Divider } from '~components/Divider';
import { makeSize } from '~utils';
import { size } from '~tokens/global';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BoxProps } from '~components/Box';
import { Box } from '~components/Box';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const TabNavItems = ({ children, ...rest }: BoxProps): React.ReactElement => {
  return (
    <Box
      {...rest}
      display="flex"
      width="100%"
      gap="spacing.0"
      position="relative"
      left="-1px"
      {...makeAnalyticsAttribute(rest)}
    >
      {React.Children.map(children, (child, index) => {
        return (
          <>
            {index > 0 ? (
              <Divider
                margin="auto"
                variant="muted"
                orientation="vertical"
                height={makeSize(size[16])}
              />
            ) : null}
            {React.cloneElement(child as React.ReactElement, {
              __isInsideTabNavItems: true,
              __index: index,
            })}
          </>
        );
      })}
      <Divider margin="auto" variant="muted" orientation="vertical" height={makeSize(size[16])} />
    </Box>
  );
};

const TabNav = ({
  children,
  items,
  ...styledProps
}: TabNavProps & StyledPropsBlade): React.ReactElement => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [controlledItems, setControlledItems] = React.useState<TabNavItemData[]>(items);

  const overflowingItems = controlledItems.filter(
    (item) => item.isAlwaysOverflowing ?? item.isOverflowing,
  );
  const _items = controlledItems.filter((item) => !item.isAlwaysOverflowing && !item.isOverflowing);

  // We need to memoize this callback otherwise it will cause infinite re-renders
  // Because the ResizeObserver callback will be a new reference on every render
  // and it will trigger a re-render
  const resizeCallback = React.useCallback((resizeInfo: ResizeObserverEntry): void => {
    const target = resizeInfo.target as HTMLElement;
    const updateItems = (): void => {
      setControlledItems((items) => {
        return items.map((item, index) => {
          // never overflow the first item
          if (index === 0) return { ...item, isOverflowing: false };
          // add padding to the offsetX to account the "More" menu's width changing due to the selection state (eg: More:ProdctName)
          // Currently, hardcoding this to 150, we can make this dynamic too but that's causing layout thrashing
          // because first we need to calculate the width of the "More" menu and then update the items
          const padding = 150;
          const offset = (item.offsetX! + padding)! - target.getBoundingClientRect().left;
          if (offset > target.offsetWidth) {
            return { ...item, isOverflowing: true };
          } else {
            return { ...item, isOverflowing: false };
          }
        });
      });
    };
    // https://github.com/webpack/webpack/issues/14814
    const flushSync = (ReactDOM as any)['flushSync'.toString()];
    // Using flushSync to avoid layout thrashing,
    // this will force React to flush all pending updates and only then update the DOM
    if (flushSync !== undefined) {
      flushSync(updateItems);
    } else {
      updateItems();
    }
  }, []);

  useResize(ref, resizeCallback);

  return (
    <TabNavContext.Provider value={{ containerRef: ref, controlledItems, setControlledItems }}>
      <BaseBox
        as="nav"
        display="flex"
        width="100%"
        alignItems="center"
        alignSelf="end"
        position="relative"
        {...getStyledProps(styledProps)}
        {...metaAttribute({ name: MetaConstants.TabNav })}
        ref={ref}
      >
        <BaseBox display="flex" width="100%" position="relative">
          <BaseBox display="flex" flexDirection="row" width="max-content">
            {children({ items: _items, overflowingItems })}
          </BaseBox>
        </BaseBox>
      </BaseBox>
    </TabNavContext.Provider>
  );
};

export { TabNav, TabNavItems };
