import { default as React } from 'react';
type CardContextType = {
    size: 'large' | 'medium' | undefined;
};
declare const CardContext: React.Context<CardContextType>;
declare const useVerifyInsideCard: (componentName: string) => CardContextType;
type CardProviderProps = {
    children: React.ReactNode;
};
declare const CardProvider: ({ children, size, }: CardProviderProps & {
    size: 'large' | 'medium';
}) => React.ReactElement;
export { useVerifyInsideCard, CardProvider, CardContext };
