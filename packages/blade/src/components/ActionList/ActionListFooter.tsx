import React from 'react';
import styled from 'styled-components';
import Box from '~components/Box';
import type { IconComponent } from '~components/Icons';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { makeSize } from '~utils';
import { BaseText } from '~components/Typography/BaseText';

type ActionListFooterProps = {
  title?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

const StyledActionListFooter = styled(Box)((props) => {
  return {
    display: 'flex',
    alignItems: 'center',
    padding: `${makeSize(props.theme.spacing[3])} ${makeSize(props.theme.spacing[5])}`,
    backgroundColor: props.theme.colors.brand.gray.a50.lowContrast,
    margin: `${makeSize(props.theme.spacing[3])} -${makeSize(props.theme.spacing[3])} -${makeSize(
      props.theme.spacing[3],
    )}`,
  };
});

const ActionListFooter = (props: ActionListFooterProps): JSX.Element => {
  const footerRef = React.useRef<HTMLDivElement | null>(null);
  const {
    setShouldIgnoreBlur,
    setHasFooterAction,
    onSelectKeydown,
    activeIndex,
    setIsOpen,
  } = useDropdown();

  React.useEffect(() => {
    if (footerRef.current?.querySelector('button, a')) {
      setHasFooterAction(true);
    }
  }, [setHasFooterAction, props.trailing]);

  return (
    <StyledActionListFooter
      ref={footerRef}
      onMouseDown={() => {
        setShouldIgnoreBlur(true);
      }}
      onKeyDown={(e) => {
        const nativeEvent = e.nativeEvent;
        if ((nativeEvent.key === ' ' || nativeEvent.key === 'Enter') && activeIndex < 0) {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSelectKeydown?.({ event: e.nativeEvent } as any);
      }}
      onBlur={(e) => {
        const nextItem = e.nativeEvent.relatedTarget;
        // @ts-expect-error: getAttribute does exist on relatedTarget
        const nextItemRole = nextItem?.getAttribute?.('role');
        console.log(nextItem);
        if (nextItemRole !== 'combobox' && nextItemRole !== 'option') {
          setIsOpen(false);
        }
      }}
    >
      <Box>{props.leading}</Box>
      <Box paddingLeft="spacing.3" paddingRight="spacing.3">
        <BaseText color="surface.text.subdued.lowContrast" fontStyle="italic" fontSize={50}>
          {props.title}
        </BaseText>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        marginLeft="auto"
        role="region"
        aria-label="listbox footer"
      >
        {props.trailing}
      </Box>
    </StyledActionListFooter>
  );
};

const ActionListFooterIcon = ({ icon }: { icon: IconComponent }): JSX.Element => {
  const Icon = icon;
  return <Icon color="surface.text.muted.lowContrast" size="small" />;
};

export { ActionListFooter, ActionListFooterIcon, ActionListFooterProps };
