import { describe, it, expect } from 'vitest';
import { createRawSnippet } from 'svelte';
import type { Component } from 'svelte';
import { render } from '@testing-library/svelte';
import { ModalBody, ModalFooter, DrawerBody, BottomSheetBody } from '../index';

const children = createRawSnippet(() => ({ render: () => '<span>x</span>' }));

describe('overlay parts', () => {
  it.each([ModalBody, ModalFooter, DrawerBody, BottomSheetBody])(
    'pass data-analytics-* to their root',
    (Part) => {
      const { getByTestId } = render((Part as unknown) as Component<Record<string, unknown>>, {
        props: { testID: 'part', 'data-analytics-part': 'body', children },
      });
      expect(getByTestId('part').dataset.analyticsPart).toBe('body');
    },
  );
});
