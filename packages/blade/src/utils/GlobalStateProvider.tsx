import React from 'react';

type GlobalStateType = {
  openDrawers: number;
  setOpenDrawers: (openDrawers: number) => void;
};

const GlobalState = React.createContext<GlobalStateType>({
  openDrawers: 0,
  setOpenDrawers: () => {},
});

const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [openDrawers, setOpenDrawers] = React.useState(0);

  return (
    <GlobalState.Provider
      value={{
        openDrawers,
        setOpenDrawers,
      }}
    >
      {children}
    </GlobalState.Provider>
  );
};

const useGlobalState = (): GlobalStateType => {
  return React.useContext(GlobalState);
};

export { GlobalStateProvider, useGlobalState };
