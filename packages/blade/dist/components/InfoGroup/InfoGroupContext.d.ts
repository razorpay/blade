import { default as React } from 'react';
import { InfoGroupProps } from './types';
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
declare const InfoGroupContext: React.Context<InfoGroupContextType>;
declare const InfoItemContext: React.Context<InfoItemContextType>;
declare const useInfoGroup: () => InfoGroupContextType;
declare const useInfoItem: () => InfoItemContextType;
export { InfoGroupContext, InfoItemContext, useInfoGroup, useInfoItem };
