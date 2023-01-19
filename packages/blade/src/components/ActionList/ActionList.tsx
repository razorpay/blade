import React from 'react';
import styled from 'styled-components';
import Box from '~components/Box';
import type { IconComponent } from '~components/Icons';
import type { DropdownContextType } from '~components/Dropdown/useDropdown';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { Text } from '~components/Typography';
import { getPlatformType, makeAccessible, makeSize } from '~utils';
import { BaseText } from '~components/Typography/BaseText';
import { Checkbox } from '~components/Checkbox';

const ActionListItemIcon = ({ icon }: { icon: IconComponent }): JSX.Element => {
  const Icon = icon;
  return <Icon color="surface.text.muted.lowContrast" size="medium" />;
};

const ActionListItemText = ({ children }: { children: string }): JSX.Element => {
  return (
    <BaseText fontStyle="italic" fontSize={50} color="surface.text.muted.lowContrast">
      {children}
    </BaseText>
  );
};

/**
 *
 * ActionListHeader
 *
 *
 */

const StyledActionListHeader = styled(Box)((props) => {
  return {
    display: 'flex',
    alignItems: 'center',
    padding: `${makeSize(props.theme.spacing[3])} ${makeSize(props.theme.spacing[5])}`,
    backgroundColor: props.theme.colors.brand.gray.a50.lowContrast,
    margin: `-${makeSize(props.theme.spacing[3])} -${makeSize(props.theme.spacing[3])} ${makeSize(
      props.theme.spacing[3],
    )}`,
  };
});

const ActionListHeader = (props: { title: string; leading?: React.ReactNode }): JSX.Element => {
  return (
    <StyledActionListHeader>
      <Box>{props.leading}</Box>
      <Box paddingLeft="spacing.3" paddingRight="spacing.3">
        <BaseText color="surface.text.subdued.lowContrast" fontStyle="italic" fontSize={50}>
          {props.title}
        </BaseText>
      </Box>
    </StyledActionListHeader>
  );
};

const ActionListHeaderIcon = ({ icon }: { icon: IconComponent }): JSX.Element => {
  const Icon = icon;
  return <Icon color="surface.text.muted.lowContrast" size="small" />;
};

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
        if (nextItemRole !== 'combobox') {
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
/**
 * @TODO for wednesday
 *
 * - [ ] Add Footer
 * - [ ] Add Section
 * - [ ] Handle a11y for Header and Footer 😭
 *
 */

// const ActionListFooter = (props) => {
//   return (

//   )
// }

/**
 *
 * ActionListItem
 *
 *
 */
type ActionListItemProps = {
  title: string;
  value: string;
  href?: string;
  /**
   * Internally passed from ActionList. No need to pass it explicitly
   */
  index?: number;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};
const StyledActionListItem = styled(Box)<{ selectionType: DropdownContextType['selectionType'] }>(
  (props) => ({
    // @TODO: use token for borderWidth (currently its not present)
    borderWidth: makeSize(3),
    borderColor: 'transparent',
    textAlign: 'left',
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: makeSize(props.theme.spacing[3]),
    borderRadius: makeSize(props.theme.border.radius.medium),
    width: '100%',
    '&:hover': {
      backgroundColor: props.theme.colors.brand.gray.a50.lowContrast,
    },
    '&.active-focus': {
      // @TODO: ask designer for exact color here (couldn't figure out from figma)
      borderColor: props.theme.colors.brand.primary[300],
    },
    // @TODO: ask designer what happens on selected item's hover
    '&[aria-selected=true]': {
      backgroundColor:
        props.selectionType === 'single' ? props.theme.colors.brand.primary[300] : undefined,
    },
  }),
);
const ActionListItem = (props: ActionListItemProps): JSX.Element => {
  const {
    activeIndex,
    dropdownBaseId,
    onOptionClick,
    selectedIndices,
    setShouldIgnoreBlur,
    selectionType,
    selectInputRef,
  } = useDropdown();

  const platformType = getPlatformType();
  const renderOnWebAs = props.href ? 'a' : 'button';
  const isReactNative = platformType === 'react-native';
  const isSelected =
    typeof props.index === 'number' ? selectedIndices.includes(props.index) : undefined;

  return (
    <StyledActionListItem
      as={!isReactNative ? renderOnWebAs : undefined}
      id={`${dropdownBaseId}-${props.index}`}
      role="option"
      tabIndex={-1}
      data-value={props.value}
      data-index={props.index}
      aria-selected={isSelected}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (typeof props.index === 'number') {
          onOptionClick(e, props.index);
        }
      }}
      onFocus={() => {
        // We don't want to keep the browser's focus on option item. We move it to selectInput
        selectInputRef.current?.focus();
      }}
      onMouseDown={() => {
        setShouldIgnoreBlur(true);
      }}
      href={props.href}
      className={activeIndex === props.index ? 'active-focus' : ''}
      selectionType={selectionType}
    >
      <Box display="flex" alignItems="center">
        {selectionType === 'multiple' ? (
          <Checkbox isChecked={isSelected} aria-hidden={true}>
            {props.leading} {props.title}
          </Checkbox>
        ) : (
          props.leading
        )}
      </Box>
      {selectionType === 'single' ? (
        <Box paddingLeft="spacing.3" paddingRight="spacing.3">
          <Text color="surface.text.normal.lowContrast">{props.title}</Text>
        </Box>
      ) : null}
      <Box display="flex" alignItems="center" marginLeft="auto">
        {props.trailing}
      </Box>
    </StyledActionListItem>
  );
};

/**
 *
 * ActionList
 *
 */

type ActionListProps = {
  children: React.ReactNode[];
  surfaceLevel?: 2 | 3;
};

const StyledActionList = styled(Box)<{ surfaceLevel: ActionListProps['surfaceLevel'] }>(
  ({ theme, surfaceLevel = 2 }) => {
    const offsetX = theme.shadows.offsetX.level[1];
    const offsetY = theme.shadows.offsetY.level[2];
    const blur = theme.shadows.blurRadius.level[2];
    const shadowColor = theme.shadows.color.level[1];

    const elevation200 = `${makeSize(offsetX)} ${makeSize(offsetY)} ${makeSize(
      blur,
    )} 0px ${shadowColor}`;
    const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;

    return {
      backgroundColor,
      borderWidth: theme.border.width.thin,
      borderColor: theme.colors.surface.border.normal.lowContrast,
      borderRadius: makeSize(theme.border.radius.medium),
      padding: makeSize(theme.spacing[3]),
      boxShadow: elevation200,
    };
  },
);

const ActionList = ({ children, surfaceLevel = 2 }: ActionListProps): JSX.Element => {
  const { setOptions, actionListRef, selectionType, dropdownBaseId } = useDropdown();
  const actionListOptions: {
    title: string;
    value: string;
  }[] = [];

  // Looping through ActionListItems to add index to them and get an options array for moving focus between items
  const childrenWithId = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // @TODO: handle the scenario where ActionListItem is inside ActionListMenu
      if (child.type === ActionListItem) {
        actionListOptions.push({
          title: child.props.title,
          value: child.props.value,
        });
        const currentIndex = actionListOptions.length - 1;
        const clonedChild = React.cloneElement(child, {
          // @ts-expect-error: TS doesn't understand the child's props
          index: currentIndex,
        });
        return clonedChild;
      }
    }

    return child;
  });

  React.useEffect(() => {
    setOptions(actionListOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOptions, children]);

  return (
    <StyledActionList
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={actionListRef as any}
      {...makeAccessible({
        role: 'listbox',
        multiSelectable: selectionType === 'multiple',
        labelledBy: `${dropdownBaseId}-label`,
      })}
      id={`${dropdownBaseId}-listbox`}
      surfaceLevel={surfaceLevel}
    >
      {childrenWithId}
    </StyledActionList>
  );
};

export {
  ActionList,
  ActionListItem,
  ActionListItemIcon,
  ActionListItemText,
  ActionListHeader,
  ActionListHeaderIcon,
  ActionListFooter,
  ActionListFooterIcon,
};
