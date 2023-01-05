import React from 'react';
import { getActionFromKey, getUpdatedIndex, performAction } from './w3Select';
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

  const onOptionChange = (actionType: number): void => {
    const max = options.length - 1;
    console.log({ max });
    setActiveIndex(getUpdatedIndex(activeIndex, max, actionType));
  };

  const onSelectKeydown: FormInputHandleOnKeyDownEvent = (e) => {
    const actionType = getActionFromKey(e, isOpen);
    if (typeof actionType === 'number') {
      performAction(actionType, e, {
        setIsOpen,
        onOptionChange,
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

  return <div style={{ display: isOpen ? 'block' : 'none' }}>{children}</div>;
}

export { Dropdown, DropdownOverlay, DropdownContext, useDropdown };
