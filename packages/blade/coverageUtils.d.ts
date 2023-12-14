/* eslint-disable @typescript-eslint/no-explicit-any */
export function getBladeCoverage(): {
  bladeCoverage: number;
  totalNodes: number;
  bladeNodes: number;
};

export function assertBladeCoverage({
  page,
  expect,
  threshold,
}: {
  page: any;
  expect: any;
  threshold?: number;
}): Promise<void>;
