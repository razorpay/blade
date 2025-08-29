import { CSSObject } from 'styled-components';
export type FadeProps = {
    show?: boolean;
    children: React.ReactNode;
    styles?: React.CSSProperties | CSSObject;
};
