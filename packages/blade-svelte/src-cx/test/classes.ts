import { expect } from 'vitest';

type WithClass = { className: string } | null | undefined;

/** Asserts a class on an element. */
export function expectClass(element: WithClass, cls: string): void {
  expect(element?.className ?? '').toContain(cls);
}

export function expectNoClass(element: WithClass, cls: string): void {
  expect(element?.className ?? '').not.toContain(cls);
}

/** Markup a component's decorative parts draw (a loader, a shimmer). */
export function expectMarkup(
  element: { innerHTML: string } | null | undefined,
  fragment: string
): void {
  expect(element?.innerHTML ?? '').toContain(fragment);
}
