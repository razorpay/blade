import React from 'react';
import { Composite } from '@floating-ui/react';
import styled from 'styled-components';
import { useTabsContext } from './TabsContext';
import { TabIndicator } from './TabIndicator';
import BaseBox from '~components/Box/BaseBox';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { Divider } from '~components/Divider';

const ScrollableArea = styled(BaseBox)(() => {
  return {
    '&::-webkit-scrollbar': { display: 'none' },
  };
});

const TabList = ({ children }: { children: React.ReactNode }): React.ReactElement => {
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
      setSelectedValue(() => first.props.value, true);
    }
  }, [children, selectedValue, setSelectedValue]);

  return (
    <BaseBox display={isVertical ? 'flex' : 'block'} flexShrink={0} overflow="hidden">
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
                    width="1.5px"
                    height="auto"
                    flexGrow={1}
                    flexShrink={0}
                    backgroundColor="surface.border.normal.lowContrast"
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
                        borderColor: 'surface.border.normal.lowContrast',
                        padding: 'spacing.2',
                        gap: isVertical ? 'spacing.0' : 'spacing.1',
                        backgroundColor: 'surface.background.level2.lowContrast',
                      }
                    : {
                        padding: 'spacing.0',
                        gap: isVertical ? 'spacing.1' : { base: 'spacing.7', m: 'spacing.8' },
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
          borderBottomColor="surface.border.normal.lowContrast"
          borderBottomWidth="thin"
        />
      ) : null}
    </BaseBox>
  );
};

export { TabList };
