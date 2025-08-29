type SnapPoints = [number, number, number];
declare function computeSnapPointBounds(unsafeHeight: number, snapPoints: SnapPoints): [nearest: number, lower: number, upper: number];
declare function computeMinContent({ maxHeight, headerHeight, footerHeight, }: {
    maxHeight: number;
    headerHeight: number;
    footerHeight: number;
}, minHeight?: number): number;
declare function computeMaxContent({ maxHeight, headerHeight, contentHeight, footerHeight, }: {
    maxHeight: number;
    headerHeight: number;
    footerHeight: number;
    contentHeight: number;
}, minHeight?: number): number;
export type { SnapPoints };
export { computeMaxContent, computeMinContent, computeSnapPointBounds };
