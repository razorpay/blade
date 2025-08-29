/// <reference types="react" />
type QuickSelectionItemProps = {
    children: string;
    isSelected: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
declare const QuickSelectionItem: ({ children, onClick, isSelected, }: QuickSelectionItemProps) => React.ReactElement;
export { QuickSelectionItem };
