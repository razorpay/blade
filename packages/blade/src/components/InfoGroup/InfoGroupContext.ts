import React from 'react';
import type { InfoGroupProps } from './types';

type InfoGroupContextType = {
  size: NonNullable<InfoGroupProps['size']>;
  itemOrientation: NonNullable<InfoGroupProps['itemOrientation']>;
  valueAlign: NonNullable<InfoGroupProps['valueAlign']>;
  isHighlighted: NonNullable<InfoGroupProps['isHighlighted']>;
};

type InfoItemContextType = {
  hasAvatar: boolean;
  setHasAvatar: (hasAvatar: boolean) => void;
  isHighlighted: boolean;
};

const InfoGroupContext = React.createContext<InfoGroupContextType>({
  size: 'medium',
  itemOrientation: 'horizontal',
  valueAlign: 'left',
  isHighlighted: false,
});

const InfoItemContext = React.createContext<InfoItemContextType>({
  hasAvatar: false,
  setHasAvatar: () => {
    // no-op default implementation
  },
  isHighlighted: false,
});

// Add hooks to use the context
const useInfoGroup = (): InfoGroupContextType => React.useContext(InfoGroupContext);
const useInfoItem = (): InfoItemContextType => React.useContext(InfoItemContext);

export { InfoGroupContext, InfoItemContext, useInfoGroup, useInfoItem };
