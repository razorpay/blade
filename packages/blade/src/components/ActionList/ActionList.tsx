import React from 'react';
import Box from '~components/Box';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { Text } from '~components/Typography';
import { getPlatformType, makeAccessible } from '~utils';

type ActionListItemProps = {
  title: string;
  value: string;
  href?: string;
  /**
   * Internally passed from ActionList. No need to pass it explicitly
   *
   * @private
   */
  _index?: number;
};
const ActionListItem = (props: ActionListItemProps): JSX.Element => {
  const {
    activeIndex,
    dropdownBaseId,
    onOptionClick,
    selectedIndices,
    setShouldIgnoreBlur,
    selectInputRef,
  } = useDropdown();

  const platformType = getPlatformType();
  const renderOnWebAs = props.href ? 'a' : 'button';
  const isReactNative = platformType === 'react-native';

  return (
    <Box
      as={!isReactNative ? renderOnWebAs : undefined}
      id={`${dropdownBaseId}-${props._index}`}
      role="option"
      data-value={props.value}
      data-index={props._index}
      aria-selected={
        typeof props._index === 'number' ? selectedIndices.includes(props._index) : undefined
      }
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (typeof props._index === 'number') {
          onOptionClick(e, props._index);
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
      style={{
        border: activeIndex === props._index ? '2px solid red' : '',
        width: '100%',
      }}
    >
      <Text>{props.title}</Text>
    </Box>
  );
};

type ActionListProps = {
  children: React.ReactNode[];
};
const ActionList = ({ children }: ActionListProps): JSX.Element => {
  const { setOptions, actionListRef, selectionType, dropdownBaseId } = useDropdown();
  const actionListOptions: {
    title: string;
    value: string;
  }[] = [];

  console.count('ActionList');

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
          _index: currentIndex,
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
    <Box
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={actionListRef as any}
      {...makeAccessible({
        role: 'listbox',
        multiSelectable: selectionType === 'multiple',
        labelledBy: `${dropdownBaseId}-label`,
      })}
      id={`${dropdownBaseId}-listbox`}
    >
      {childrenWithId}
    </Box>
  );
};

export { ActionList, ActionListItem };
