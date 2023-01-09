import React from 'react';
import {
  getActionFromKey,
  getIndexByLetter,
  getUpdatedIndex,
  isElementVisibleOnScreen,
  isScrollable,
  performAction,
} from './w3Select';
import type { FormInputHandleOnKeyDownEvent } from '~components/Form/FormTypes';

export type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  options: string[];
  setOptions: (value: string[]) => void;
  activeIndex: number;
  setActiveIndex: (value: number) => void;
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
  value: '',
  setValue: noop,
  options: [],
  setOptions: noop,
  activeIndex: -1,
  setActiveIndex: noop,
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
};
const useDropdown = (): UseDropdownReturnValue => {
  const {
    isOpen,
    setIsOpen,
    value,
    setValue,
    activeIndex,
    setActiveIndex,
    options,
    ...rest
  } = React.useContext(DropdownContext);

  const onSelectClick: React.MouseEventHandler<HTMLInputElement> = (_e) => {
    setIsOpen(!isOpen);
  };

  const onOptionChange = (actionType: number, index?: number): void => {
    const max = options.length - 1;
    const newIndex = index ?? activeIndex;
    setActiveIndex(getUpdatedIndex(newIndex, max, actionType));
    ensureScrollVisiblity(newIndex, rest.actionListRef.current, options);
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
    const actionType = getActionFromKey(e, isOpen);
    if (typeof actionType === 'number') {
      performAction(actionType, e, {
        setIsOpen,
        onOptionChange,
        onComboType,
      });
    }
  };

  return {
    isOpen,
    setIsOpen,
    value,
    setValue,
    onSelectClick,
    onSelectKeydown,
    activeIndex,
    setActiveIndex,
    options,
    ...rest,
  };
};

function Dropdown({ children }: { children: React.ReactNode[] }): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [options, setOptions] = React.useState<string[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const selectInputRef = React.useRef<HTMLButtonElement>(null);
  const actionListRef = React.useRef<HTMLDivElement>(null);

  // @TODO: replace this with some id generation method
  const dropdownBaseId = 'dropdown-1';

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        setIsOpen,
        value,
        setValue,
        options,
        setOptions,
        activeIndex,
        setActiveIndex,
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
