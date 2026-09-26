import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { globalOverlays, type Overlays } from '../components/modal/overlays';
import ModalStackContent from './fixtures/ModalStackContent.svelte';
import ModalStackHarness from './fixtures/ModalStackHarness.svelte';
import { expectMarkup } from './classes';

function setup(props: { captureError?: (error: unknown) => void } = {}) {
  let overlays: Overlays | undefined;
  const view = render(ModalStackHarness, {
    props: {
      ...props,
      onReady: (ready: Overlays) => {
        overlays = ready;
      },
    },
  });
  return { ...view, overlays: overlays as Overlays };
}

const escape = () => fireEvent.keyDown(document, { key: 'Escape' });

describe('openModal', () => {
  it('renders the component in a modal and settles with what it closes with', () => {
    const { overlays, getByTestId, queryByTestId } = setup();
    const handle = overlays.openModal(ModalStackContent, {
      props: { bank: 'HDFC' },
      title: 'Redirecting',
      testID: 'notice',
    });

    return waitFor(() => expect(getByTestId('notice')).toBeTruthy())
      .then(() => {
        expect(getByTestId('notice').getAttribute('role')).toBe('dialog');
        expect(getByTestId('bank').textContent).toBe('HDFC');
        return fireEvent.click(getByTestId('continue'));
      })
      .then(() => handle.result)
      .then((result) => {
        expect(result).toBe(true);
        return waitFor(() => expect(queryByTestId('notice')).toBeNull());
      })
      .then(() => {
        expect(overlays.stack.count()).toBe(0);
      });
  });

  it('opens: a modal the stack mounts already open still leaves `closed`', () => {
    // Svelte plays no intro for a block a parent creates, so the state must
    // not depend on one — else the panel stays parked off its host.
    const { overlays, getByTestId } = setup();
    overlays.openModal(ModalStackContent, {
      props: { bank: 'HDFC' },
      testID: 'notice',
    });
    return waitFor(() => expect(getByTestId('notice')).toBeTruthy()).then(() =>
      waitFor(() =>
        expect(getByTestId('notice').parentElement?.dataset.state).toBe('open')
      )
    );
  });

  it('a dismiss settles with undefined and reports its source', () => {
    const onDismiss = vi.fn();
    const { overlays, getByTestId } = setup();
    const handle = overlays.openModal(ModalStackContent, {
      props: { bank: 'SBI' },
      onDismiss,
      testID: 'notice',
    });
    return waitFor(() => expect(getByTestId('notice')).toBeTruthy())
      .then(() => escape())
      .then(() => handle.result)
      .then((result) => {
        expect(result).toBeUndefined();
        expect(onDismiss).toHaveBeenCalledWith('escape');
      });
  });

  it('stacks: Escape closes only the top modal', () => {
    const { overlays, getByTestId, queryByTestId } = setup();
    overlays.openModal(ModalStackContent, {
      props: { bank: 'first' },
      testID: 'first',
    });
    const top = overlays.openModal(ModalStackContent, {
      props: { bank: 'second' },
      testID: 'second',
    });
    return waitFor(() => expect(getByTestId('second')).toBeTruthy())
      .then(() => escape())
      .then(() => top.result)
      .then(() => waitFor(() => expect(queryByTestId('second')).toBeNull()))
      .then(() => {
        expect(getByTestId('first')).toBeTruthy();
        expect(overlays.stack.count()).toBe(1);
      });
  });

  it('updates the props of an open modal', () => {
    const { overlays, getByTestId } = setup();
    const handle = overlays.openModal(ModalStackContent, {
      props: { bank: 'HDFC' },
    });
    return waitFor(() =>
      expect(getByTestId('bank').textContent).toBe('HDFC')
    ).then(() => {
      handle.update({ bank: 'ICICI' });
      return waitFor(() =>
        expect(getByTestId('bank').textContent).toBe('ICICI')
      );
    });
  });

  it('opens at once with the pending shimmer while a promised component loads', () => {
    let deliver: (module: {
      default: typeof ModalStackContent;
    }) => void = () => {};
    const promised = new Promise<{ default: typeof ModalStackContent }>(
      (resolve) => {
        deliver = resolve;
      }
    );
    const { overlays, getByTestId, queryByTestId, container } = setup();
    overlays.openModal(promised, {
      props: { bank: 'AXIS' },
      pendingLabel: 'Loading',
      testID: 'lazy',
    });

    return waitFor(() => expect(getByTestId('lazy')).toBeTruthy())
      .then(() => {
        const pending = document.querySelector('[aria-busy="true"]');
        expect(pending?.getAttribute('role')).toBe('status');
        expect(pending?.getAttribute('aria-label')).toBe('Loading');
        expectMarkup(pending, 'animate-skeleton');
        expect(queryByTestId('bank')).toBeNull();
        deliver({ default: ModalStackContent });
        return waitFor(() =>
          expect(getByTestId('bank').textContent).toBe('AXIS')
        );
      })
      .then(() => {
        expect(document.querySelector('[aria-busy="true"]')).toBeNull();
        expect(container).toBeTruthy();
      });
  });

  it('a failed load closes the modal and reports the error', () => {
    const captureError = vi.fn();
    const onLoadError = vi.fn();
    const failure = new Error('chunk failed');
    const { overlays, queryByTestId } = setup({ captureError });
    const handle = overlays.openModal<Record<string, never>>(
      Promise.reject(failure),
      {
        onLoadError,
        testID: 'lazy',
      }
    );
    return handle.result
      .then((result) => {
        expect(result).toBeUndefined();
        expect(onLoadError).toHaveBeenCalledWith(failure);
        expect(captureError).toHaveBeenCalledWith(failure);
        return waitFor(() => expect(queryByTestId('lazy')).toBeNull());
      })
      .then(() => {
        expect(overlays.stack.count()).toBe(0);
      });
  });

  it('a provided stack is separate from the global one', () => {
    const { overlays } = setup();
    overlays.openModal(ModalStackContent, {
      props: { bank: 'HDFC' },
    });
    expect(overlays.stack.count()).toBe(1);
    expect(globalOverlays.stack.count()).toBe(0);
  });
});
