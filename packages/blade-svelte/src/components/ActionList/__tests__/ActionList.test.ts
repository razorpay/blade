import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { getActionListItemClasses, getActionListWrapperClasses } from '@razorpay/blade-core/styles';
import ActionListTestHarness from './ActionListTestHarness.svelte';
import ActionListInBottomSheetTestHarness from './ActionListInBottomSheetTestHarness.svelte';

describe('<ActionList />', () => {
  it('standalone: outer shell is plain without scroll wrapper classes', () => {
    render(ActionListTestHarness, { props: { testID: 'action-list' } });

    const outer = screen.getByTestId('action-list');
    const wrapperClass = getActionListWrapperClasses({ isInBottomSheet: false });

    expect(outer).toHaveAttribute('role', 'listbox');
    expect(outer).not.toHaveClass(wrapperClass);

    const inner = outer.firstElementChild as HTMLElement | null;
    expect(inner).not.toBeNull();
    expect(inner).toHaveClass(wrapperClass);
  });

  it('standalone: nests items inside the inner scroll wrapper', () => {
    render(ActionListTestHarness, { props: { testID: 'action-list' } });

    const outer = screen.getByTestId('action-list');
    const inner = outer.firstElementChild as HTMLElement;

    expect(inner.querySelector('[role="option"]')).toBeInTheDocument();
  });

  it('density: default (omitted) applies no density override class to rows', () => {
    render(ActionListTestHarness, { props: { testID: 'action-list' } });

    const item = screen.getByRole('option');
    const denseClass = getActionListItemClasses({ density: 'dense' });
    const normalClass = getActionListItemClasses({ density: 'normal' });

    expect(item).not.toHaveClass(denseClass);
    expect(item).not.toHaveClass(normalClass);
  });

  it('density="dense" applies the dense (compact) padding class to rows', () => {
    render(ActionListTestHarness, { props: { testID: 'action-list', density: 'dense' } });

    const item = screen.getByRole('option');
    expect(item).toHaveClass(getActionListItemClasses({ density: 'dense' }));
  });

  it('density="normal" applies the normal (roomy) padding class to rows', () => {
    render(ActionListTestHarness, { props: { testID: 'action-list', density: 'normal' } });

    const item = screen.getByRole('option');
    expect(item).toHaveClass(getActionListItemClasses({ density: 'normal' }));
  });

  it('in BottomSheet: renders a single scroll wrapper without an outer shell', () => {
    render(ActionListInBottomSheetTestHarness);

    const root = screen.getByTestId('action-list-in-sheet');
    expect(root).toHaveClass(getActionListWrapperClasses({ isInBottomSheet: true }));
    expect(root.children).toHaveLength(1);
    expect(root.querySelector('[role="option"]')).toBeInTheDocument();
  });
});
