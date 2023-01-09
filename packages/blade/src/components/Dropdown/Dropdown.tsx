import React from 'react';
import {
  getActionFromKey,
  getIndexByLetter,
  getUpdatedIndex,
  isElementVisibleOnScreen,
  isScrollable,
  performAction,
} from './w3Select';
import type {
  FormInputHandleOnEvent,
  FormInputHandleOnKeyDownEvent,
} from '~components/Form/FormTypes';

export type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (value: number) => void;
  options: string[];
  setOptions: (value: string[]) => void;
  activeIndex: number;
  setActiveIndex: (value: number) => void;
  shouldIgnoreBlur: boolean;
  setShouldIgnoreBlur: (value: boolean) => void;
  dropdownBaseId: string;
  selectInputRef: {
    current: HTMLButtonElement | null;
  };
  actionListRef: {
    current: HTMLDivElement | null;
  };
};
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const DropdownContext = React.createContext<DropdownContextType>({
  isOpen: false,
  setIsOpen: noop,
  selectedIndex: -1,
  setSelectedIndex: noop,
  options: [],
  setOptions: noop,
  activeIndex: -1,
  setActiveIndex: noop,
  shouldIgnoreBlur: false,
  setShouldIgnoreBlur: noop,
  dropdownBaseId: '',
  actionListRef: {
    current: null,
  },
  selectInputRef: {
    current: null,
  },
});

let searchTimeout: number;
// eslint-disable-next-line one-var
let searchString = '';

const ensureScrollVisiblity = (
  newActiveIndex: number,
  containerElement: HTMLElement | null,
  options: string[],
): void => {
  //   // ensure the new option is in view
  if (containerElement) {
    if (isScrollable(containerElement)) {
      const optionEl = containerElement.querySelectorAll<HTMLElement>('[role="option"]');
      // Making sure its the same element as the one from options state
      if (
        newActiveIndex >= 0 &&
        optionEl[newActiveIndex].dataset.value === options[newActiveIndex]
      ) {
        const activeElement = optionEl[newActiveIndex];
        activeElement.scrollIntoView({ block: 'start', inline: 'start' });

        if (!isElementVisibleOnScreen(optionEl[newActiveIndex])) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }
};

type UseDropdownReturnValue = DropdownContextType & {
  onSelectClick: React.MouseEventHandler<HTMLInputElement>;
  onSelectKeydown: FormInputHandleOnKeyDownEvent | undefined;
  onSelectBlur: FormInputHandleOnEvent | undefined;
  onOptionClick: (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => void;
  value: string;
};
const useDropdown = (): UseDropdownReturnValue => {
  const {
    isOpen,
    setIsOpen,
    selectedIndex,
    setSelectedIndex,
    activeIndex,
    setActiveIndex,
    shouldIgnoreBlur,
    setShouldIgnoreBlur,
    options,
    ...rest
  } = React.useContext(DropdownContext);

  const onSelectClick: React.MouseEventHandler<HTMLInputElement> = (_e) => {
    setIsOpen(!isOpen);
  };

  const onSelectBlur = (): void => {
    if (shouldIgnoreBlur) {
      setShouldIgnoreBlur(false);
      return;
    }

    if (isOpen) {
      setSelectedIndex(activeIndex);
      setIsOpen(false);
    }
  };

  const onOptionChange = (actionType: number, index?: number): void => {
    const max = options.length - 1;
    const newIndex = index ?? activeIndex;
    setActiveIndex(getUpdatedIndex(newIndex, max, actionType));
    ensureScrollVisiblity(newIndex, rest.actionListRef.current, options);
  };

  const onOptionClick = (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ): void => {
    const actionType = getActionFromKey(e, isOpen);
    if (typeof actionType === 'number') {
      onOptionChange(actionType, index);
    }
    setSelectedIndex(index);
    setActiveIndex(index);
    setIsOpen(false);
  };

  const onComboType = (letter: string, actionType: number): void => {
    // open the listbox if it is closed
    setIsOpen(true);

    if (typeof searchTimeout === 'number') {
      window.clearTimeout(searchTimeout);
    }

    searchTimeout = window.setTimeout(() => {
      searchString = '';
    }, 500);
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    searchString = searchString + letter;
    const searchIndex = getIndexByLetter(options, searchString, activeIndex + 1);

    // if a match was found, go to it
    if (searchIndex >= 0) {
      onOptionChange(actionType, searchIndex);
    }
    // if no matches, clear the timeout and search string
    else {
      window.clearTimeout(searchTimeout);
      searchString = '';
    }
  };

  const onSelectKeydown: FormInputHandleOnKeyDownEvent = (e) => {
    const actionType = getActionFromKey(e.event, isOpen);
    if (typeof actionType === 'number') {
      performAction(actionType, e, {
        setIsOpen,
        onOptionChange,
        onComboType,
        selectCurrentOption: () => {
          setSelectedIndex(activeIndex);
        },
      });
    }
  };

  return {
    isOpen,
    setIsOpen,
    selectedIndex,
    setSelectedIndex,
    onSelectClick,
    onSelectKeydown,
    onSelectBlur,
    onOptionClick,
    activeIndex,
    setActiveIndex,
    shouldIgnoreBlur,
    setShouldIgnoreBlur,
    options,
    value: options[selectedIndex],
    ...rest,
  };
};

function Dropdown({ children }: { children: React.ReactNode[] }): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [shouldIgnoreBlur, setShouldIgnoreBlur] = React.useState(false);
  const selectInputRef = React.useRef<HTMLButtonElement>(null);
  const actionListRef = React.useRef<HTMLDivElement>(null);

  // @TODO: replace this with some id generation method
  const dropdownBaseId = 'dropdown-1';

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        setIsOpen,
        selectedIndex,
        setSelectedIndex,
        options,
        setOptions,
        activeIndex,
        setActiveIndex,
        shouldIgnoreBlur,
        setShouldIgnoreBlur,
        dropdownBaseId,
        selectInputRef,
        actionListRef,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

function DropdownOverlay({ children }: { children: React.ReactNode }): JSX.Element {
  const { isOpen } = useDropdown();

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }} tabIndex={-1}>
      {children}
    </div>
  );
}

export { Dropdown, DropdownOverlay, DropdownContext, useDropdown };
