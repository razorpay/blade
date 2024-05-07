import React from 'react';

type SideNavLevelContextType = {
  level: number;
  isSideNavLevelActive?: boolean;
  setIsSideNavLevelActive?: (isSideNavLevelActive: boolean) => void;
};

const SideNavLevelContext = React.createContext<SideNavLevelContextType>({
  level: 1,
});

const useSideNavLevel = (): SideNavLevelContextType => {
  return React.useContext(SideNavLevelContext);
};

const SideNavLevel = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { level: prevLevel } = useSideNavLevel();
  const [isSideNavLevelActive, setIsSideNavLevelActive] = React.useState(false);

  const contextValue = React.useMemo<SideNavLevelContextType>(
    () => ({
      level: prevLevel + 1,
      isSideNavLevelActive,
      setIsSideNavLevelActive,
    }),
    [prevLevel, isSideNavLevelActive],
  );

  return (
    <SideNavLevelContext.Provider value={contextValue}>{children}</SideNavLevelContext.Provider>
  );
};

export { SideNavLevel, useSideNavLevel };
