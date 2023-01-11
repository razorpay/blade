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
   */
  index?: number;
};
const ActionListItem = (props: ActionListItemProps): JSX.Element => {
  const {
    activeIndex,
    dropdownBaseId,
    onOptionClick,
    selectedIndices,
    setShouldIgnoreBlur,
  } = useDropdown();

  const platformType = getPlatformType();
  const renderOnWebAs = props.href ? 'a' : 'button';
  const isReactNative = platformType === 'react-native';

  return (
    <Box
      as={!isReactNative ? renderOnWebAs : undefined}
      id={`${dropdownBaseId}-${props.index}`}
      role="option"
      data-value={props.value}
      data-index={props.index}
      aria-selected={
        typeof props.index === 'number' ? selectedIndices.includes(props.index) : undefined
      }
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (typeof props.index === 'number') {
          onOptionClick(e, props.index);
        }
      }}
      onMouseDown={() => {
        setShouldIgnoreBlur(true);
      }}
      href={props.href}
      style={{
        border: activeIndex === props.index ? '2px solid red' : '',
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
  }, [setOptions]);

  return (
    <Box
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={actionListRef as any}
      // as="div"
      {...makeAccessible({
        role: 'listbox',
      })}
      id={`${dropdownBaseId}-listbox`}
      aria-multiselectable={selectionType === 'multiple'}
    >
      {childrenWithId}
    </Box>
  );
};

export { ActionList, ActionListItem };
