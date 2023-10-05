import React from 'react';
import { Composite } from '@floating-ui/react';
import styled from 'styled-components';
import { useTabsContext } from './TabsContext';
import { TabsIndicator } from './TabsIndicator';
import BaseBox from '~components/Box/BaseBox';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { Divider } from '~components/Divider';

const ScrollableArea = styled(BaseBox)(() => {
  return {
    '&::-webkit-scrollbar': { display: 'none' },
  };
});

const TabsList = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { setSelectedValue, selectedValue, variant } = useTabsContext();
  const tabListContainerRef = React.useRef<HTMLDivElement>(null);

  // Set the first child as the selected value
  useIsomorphicLayoutEffect(() => {
    if (selectedValue) return;
    const first = React.Children.toArray(children)[0];
    if (React.isValidElement(first)) {
      setSelectedValue(() => first.props.value);
    }
  }, [children, selectedValue, setSelectedValue]);

  return (
    <BaseBox overflow="hidden">
      <ScrollableArea
        position="relative"
        display="inline-block"
        whiteSpace="nowrap"
        flex="1 1 auto"
        width="100%"
        overflow="auto hidden"
      >
        <Composite
          render={(htmlProps) => {
            return (
              // @ts-expect-error spreading composite props
              <BaseBox
                {...htmlProps}
                role="tablist"
                display="flex"
                flexDirection="row"
                alignItems="center"
                width="100%"
                ref={tabListContainerRef}
                {...(variant === 'bordered'
                  ? {
                      padding: 'spacing.0',
                    }
                  : {
                      borderRadius: 'small',
                      borderWidth: 'thick',
                      borderColor: 'surface.border.normal.lowContrast',
                      padding: 'spacing.2',
                      backgroundColor: 'surface.background.level2.lowContrast',
                    })}
              >
                {variant === 'filled'
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
            );
          }}
        />
        <TabsIndicator tabListContainerRef={tabListContainerRef} />
      </ScrollableArea>
      {/* 
        Static border bottom, can't just put it on the outer Box of tablist because 
        it's not possible to offset or translate a border 
      */}
      {variant === 'bordered' ? (
        <BaseBox
          style={{ transform: 'translateY(-5.5px)' }}
          borderBottomColor="surface.border.normal.lowContrast"
          borderBottomWidth="thick"
        />
      ) : null}
    </BaseBox>
  );
};

export { TabsList };
