declare const getBladeCoverage: () => {
    bladeCoverage: number;
    totalNodes: number;
    bladeNodes: number;
};
declare const assertBladeCoverage: ({ page, expect, threshold, }: {
    page: any;
    expect: any;
    threshold: number;
}) => Promise<void>;
