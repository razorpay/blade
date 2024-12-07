import React from 'react';
import { Composite } from '@floating-ui/react';
import styled from 'styled-components';
import { useTabsContext } from './TabsContext';
import { TabIndicator } from './TabIndicator';
import { trackColor } from './tabTokens';
import BaseBox from '~components/Box/BaseBox';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { Divider } from '~components/Divider';
import { Box } from '~components/Box';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { DataAnalyticsAttribute } from '~utils/types';

const ScrollableArea = styled(BaseBox)(() => {
  return {
    '&::-webkit-scrollbar': { display: 'none' },
  };
});

const TabList = ({
  children,
  ...rest
}: { children: React.ReactNode } & StyledPropsBlade &
  DataAnalyticsAttribute): React.ReactElement => {
  const { setSelectedValue, selectedValue, variant, isVertical } = useTabsContext();
  const tabListContainerRef = React.useRef<HTMLDivElement>(null);
  const isBordered = variant === 'bordered';
  const isFilled = variant === 'filled';

  // Set the first child as the selected value
  useIsomorphicLayoutEffect(() => {
    if (selectedValue) return;
    const first = React.Children.toArray(children)[0];
    if (React.isValidElement(first)) {
      // We need to skip calling onChange on the first render when we set the initial value
      setSelectedValue?.(() => first.props.value, true);
    }
  }, [children, selectedValue, setSelectedValue]);

  return (
    <Box
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.TabList })}
      {...makeAnalyticsAttribute(rest)}
      display={isVertical ? 'flex' : 'block'}
      flexShrink={0}
      overflow="hidden"
    >
      <ScrollableArea
        position="relative"
        whiteSpace="nowrap"
        flex="1 1 auto"
        width="100%"
        overflow="auto hidden"
      >
        <Composite
          render={(htmlProps) => {
            return (
              <BaseBox flexDirection="row" display="flex">
                {isVertical && isBordered ? (
                  <BaseBox
                    width="0px"
                    height="auto"
                    flexGrow={1}
                    flexShrink={0}
                    borderColor={trackColor}
                    borderWidth="thin"
                    style={{ transform: 'translateX(1.5px)' }}
                  />
                ) : null}
                {/* @ts-expect-error spreading composite props */}
                <BaseBox
                  {...htmlProps}
                  flexGrow={1}
                  ref={tabListContainerRef}
                  role="tablist"
                  width="100%"
                  display="flex"
                  flexDirection={isVertical ? 'column' : 'row'}
                  alignItems={isVertical ? 'start' : 'center'}
                  overflow={isVertical ? 'hidden' : undefined}
                  {...(isFilled
                    ? {
                        borderRadius: 'small',
                        borderWidth: 'thin',
                        borderColor: 'interactive.border.gray.faded',
                        padding: 'spacing.2',
                        gap: isVertical ? 'spacing.0' : 'spacing.1',
                        backgroundColor: 'surface.background.gray.intense',
                      }
                    : {
                        padding: 'spacing.0',
                        gap: isVertical ? 'spacing.0' : { base: 'spacing.7', m: 'spacing.8' },
                      })}
                >
                  {variant === 'filled' && !isVertical
                    ? React.Children.map(children, (child, index) => {
                        return (
                          <>
                            {index > 0 ? (
                              <Divider
                                margin="auto"
                                height="20px"
                                variant="subtle"
                                orientation="vertical"
                              />
                            ) : null}
                            {child}
                          </>
                        );
                      })
                    : children}
                </BaseBox>
              </BaseBox>
            );
          }}
        />
        {!isVertical ? <TabIndicator tabListContainerRef={tabListContainerRef} /> : null}
      </ScrollableArea>
      {/*
        Adding border bottom with an div element, we can't put it on the outer Box of tablist because 
        it's not possible to offset or translate a border 
      */}
      {!isVertical && isBordered ? (
        <BaseBox
          style={{ transform: 'translateY(-1px)' }}
          borderBottomColor={trackColor}
          borderBottomWidth="thin"
        />
      ) : null}
    </Box>
  );
};

export { TabList };
