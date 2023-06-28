import { axe } from 'jest-axe';
import type { JestAxeConfigureOptions } from 'jest-axe';

export default async function assertAccessible(
  container: string | Element,
  axeOptions?: JestAxeConfigureOptions,
): Promise<void> {
  const results = await axe(container, axeOptions);
  expect(results).toHaveNoViolations();
}
