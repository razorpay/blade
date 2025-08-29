import { ReactElement } from 'react';
type CharacterCounterProps = {
    currentCount: number;
    maxCount: number;
    size?: 'medium' | 'large';
};
export declare const CharacterCounter: ({ currentCount, maxCount, size, }: CharacterCounterProps) => ReactElement;
export {};
