import React from 'react';

type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  value: string;
  setValue: (value: string) => void;
};
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const DropdownContext = React.createContext<DropdownContextType>({
  isOpen: false,
  setIsOpen: noop,
  value: '',
  setValue: noop,
});

function Dropdown({ children }: { children: React.ReactNode[] }): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, value, setValue }}>
      {children}
    </DropdownContext.Provider>
  );
}

function DropdownOverlay({ children }: { children: React.ReactNode }): JSX.Element {
  const { isOpen } = React.useContext(DropdownContext);

  return <div style={{ display: isOpen ? 'block' : 'none' }}>{children}</div>;
}

export { Dropdown, DropdownOverlay, DropdownContext };
