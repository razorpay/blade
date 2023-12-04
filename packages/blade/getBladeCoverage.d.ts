/* eslint-disable @typescript-eslint/no-explicit-any, one-var */
export const getBladeCoverage: () => {
  bladeCoverage: number;
  totalNodes: number;
  bladeNodes: number;
};

export const assertBladeCoverage: ({
  page,
  expect,
  threshold,
}: {
  page: any;
  expect: any;
  threshold: number;
}) => Promise<void>;
