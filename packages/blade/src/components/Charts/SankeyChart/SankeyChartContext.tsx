import React, { createContext, useContext, useState } from 'react';

type SankeyChartContextType = {
  hoveredNodeId: number | null;
  hoveredLinkId: number | null;
  setHoveredNodeId: (id: number | null) => void;
  setHoveredLinkId: (id: number | null) => void;
};

const SankeyChartContext = createContext<SankeyChartContextType | null>(null);

export function SankeyChartProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
  const [hoveredLinkId, setHoveredLinkId] = useState<number | null>(null);

  return (
    <SankeyChartContext.Provider
      value={{ hoveredNodeId, hoveredLinkId, setHoveredNodeId, setHoveredLinkId }}
    >
      {children}
    </SankeyChartContext.Provider>
  );
}

export function useSankeyChartContext(): SankeyChartContextType {
  const ctx = useContext(SankeyChartContext);
  if (!ctx) throw new Error('useSankeyChartContext must be used inside SankeyChartProvider');
  return ctx;
}
