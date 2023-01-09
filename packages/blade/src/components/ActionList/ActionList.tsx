import React from 'react';
import Box from '~components/Box';
import { useDropdown } from '~components/Dropdown/Dropdown';

type ActionListItemProps = {
  title: string;
  value: string;
  href?: string;
  index: number;
};
const ActionListItem = (props: ActionListItemProps): JSX.Element => {
  const {
    activeIndex,
    dropdownBaseId,
    onOptionClick,
    selectedIndex,
    setShouldIgnoreBlur,
  } = useDropdown();

  return (
    <Box
      as={props.href ? 'a' : 'button'}
      id={`${dropdownBaseId}-${props.index}`}
      role="option"
      data-value={props.value}
      data-index={props.index}
      aria-selected={selectedIndex === props.index}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onOptionClick(e, props.index);
      }}
      onMouseDown={() => {
        setShouldIgnoreBlur(true);
      }}
      href={props.href}
      style={{
        border: activeIndex === props.index ? '2px solid red' : '',
        display: 'block',
        width: '100%',
      }}
    >
      {props.title}
    </Box>
  );
};

const ActionList = ({ children }: { children: React.ReactNode[] }): JSX.Element => {
  const { setOptions, actionListRef } = useDropdown();
  const actionListOptions: string[] = [];
  const childrenWithId = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // @TODO: handle the scenario where ActionListItem is inside ActionListMenu
      if (child.type === ActionListItem) {
        actionListOptions.push(child.props.value);
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
    // @TODO: put aria-labelledby if needed
    <Box ref={actionListRef} as="div" role="listbox">
      {childrenWithId}
    </Box>
  );
};

export { ActionList, ActionListItem };
