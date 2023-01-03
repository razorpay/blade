import React from 'react';

type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const DropdownContext = React.createContext<DropdownContextType>({
  isOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsOpen: () => {},
});

function Dropdown({ children }: { children: React.ReactNode[] }): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>{children}</DropdownContext.Provider>
  );
}

function DropdownOverlay({ children }: { children: React.ReactNode }): JSX.Element {
  const { isOpen } = React.useContext(DropdownContext);

  return <div style={{ display: isOpen ? 'block' : 'none' }}>{children}</div>;
}

export { Dropdown, DropdownOverlay, DropdownContext };
