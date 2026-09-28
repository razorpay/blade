import React from 'react';
import userEvents from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { Popover } from '..';
import { Button } from '~components/Button';
import { Tooltip } from '~components/Tooltip';
import { Text } from '~components/Typography';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

// Hover popovers share BladeProvider's FloatingDelayGroup with every Tooltip. These tests use real
// timers: switching between overlays depends on the order of hover events and short delays

// shorter than Popover / Tooltip's exit animation (motion.duration.quick, 200ms): a replaced
// overlay has to be gone before it could have finished fading out
const REPLACED_OVERLAY_TIMEOUT = 100;

// `renderWithTheme` wraps only the initial render; rerenders need the provider again
const withTheme = (ui: React.ReactElement): React.ReactElement => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
    {ui}
  </BladeProvider>
);

// the transition Popover's content fades in with (useTransitionStyles, applied through a
// styled-components class, so it is read from the computed style)
const getOpenTransitionDuration = (dialog: HTMLElement): string | undefined =>
  [dialog, ...Array.from(dialog.querySelectorAll<HTMLElement>('*'))]
    .map((element) => window.getComputedStyle(element).transitionDuration)
    .find(Boolean);

describe('<Popover openInteraction="hover" /> in the tooltip delay group', () => {
  it('should switch from one hover popover to the next in place', async () => {
    const user = userEvents.setup();
    const { getByRole, getAllByRole } = renderWithTheme(
      <>
        <Popover openInteraction="hover" title="Success" content={<Text>Success preview</Text>}>
          <Button>Success</Button>
        </Popover>
        <Popover openInteraction="hover" title="Retry" content={<Text>Retry preview</Text>}>
          <Button>Retry</Button>
        </Popover>
      </>,
    );

    await user.hover(getByRole('button', { name: 'Success' }));
    // the first popover of a hover streak fades in as usual
    await waitFor(() => expect(getOpenTransitionDuration(getByRole('dialog'))).toBe('200ms'));

    await user.hover(getByRole('button', { name: 'Retry' }));
    await waitFor(
      () => {
        const dialogs = getAllByRole('dialog');
        // the replaced popover does not fade out under the new one...
        expect(dialogs).toHaveLength(1);
        expect(dialogs[0]).toHaveTextContent('Retry preview');
        // ...and the new one appears in place instead of fading in
        expect(getOpenTransitionDuration(dialogs[0])).toBe('0ms');
      },
      { timeout: REPLACED_OVERLAY_TIMEOUT },
    );
  });

  it('should switch between a tooltip and a hover popover in place', async () => {
    const user = userEvents.setup();
    const { getByRole, findByRole, queryByRole } = renderWithTheme(
      <>
        <Tooltip content="Processing hint">
          <Button>Processing</Button>
        </Tooltip>
        <Popover openInteraction="hover" title="Success" content={<Text>Success preview</Text>}>
          <Button>Success</Button>
        </Popover>
      </>,
    );

    await user.hover(getByRole('button', { name: 'Processing' }));
    await findByRole('tooltip');

    await user.hover(getByRole('button', { name: 'Success' }));
    await waitFor(
      () => {
        expect(queryByRole('tooltip')).not.toBeInTheDocument();
        expect(queryByRole('dialog')).toBeInTheDocument();
      },
      { timeout: REPLACED_OVERLAY_TIMEOUT },
    );

    await user.hover(getByRole('button', { name: 'Processing' }));
    await waitFor(
      () => {
        expect(queryByRole('dialog')).not.toBeInTheDocument();
        expect(queryByRole('tooltip')).toHaveTextContent('Processing hint');
      },
      { timeout: REPLACED_OVERLAY_TIMEOUT },
    );
  });

  it('should close when the pointer leaves for somewhere without an overlay', async () => {
    const user = userEvents.setup();
    const { getByRole, findByRole, queryByRole } = renderWithTheme(
      <>
        <Popover openInteraction="hover" title="Success" content={<Text>Success preview</Text>}>
          <Button>Success</Button>
        </Popover>
        <Button>Plain</Button>
      </>,
    );

    await user.hover(getByRole('button', { name: 'Success' }));
    await findByRole('dialog');

    await user.hover(getByRole('button', { name: 'Plain' }));
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('should not close a click popover when a tooltip opens', async () => {
    const user = userEvents.setup();
    const { getByRole, findByRole, queryByRole } = renderWithTheme(
      <>
        <Popover title="Filters" content={<Text>Filter options</Text>}>
          <Button>Filters</Button>
        </Popover>
        <Tooltip content="Processing hint">
          <Button>Processing</Button>
        </Tooltip>
      </>,
    );

    await user.click(getByRole('button', { name: 'Filters' }));
    await findByRole('dialog');

    // the click popover is modal, so the rest of the page is hidden from the accessibility tree
    await user.hover(getByRole('button', { name: 'Processing', hidden: true }));
    await findByRole('tooltip', { hidden: true });
    // longer than the exit animation: a popover the group closed would be gone by now
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(queryByRole('dialog')).toBeInTheDocument();
  });

  it('should not hide the rest of the page from assistive tech while open', async () => {
    const user = userEvents.setup();
    const { getByRole, findByRole } = renderWithTheme(
      <>
        <Popover openInteraction="hover" title="Success" content={<Text>Success preview</Text>}>
          <Button>Success</Button>
        </Popover>
        <Button>Plain</Button>
      </>,
    );

    await user.hover(getByRole('button', { name: 'Success' }));
    await findByRole('dialog');
    // a modal popover would mark everything outside it aria-hidden
    expect(getByRole('button', { name: 'Plain' })).toBeInTheDocument();
  });

  it('should ask a controlled hover popover to close when another overlay replaces it', async () => {
    const user = userEvents.setup();
    const onOpenChange = jest.fn();
    const { getByRole, findByRole } = renderWithTheme(
      <>
        <Popover
          openInteraction="hover"
          isOpen={true}
          onOpenChange={onOpenChange}
          title="Success"
          content={<Text>Success preview</Text>}
        >
          <Button>Success</Button>
        </Popover>
        <Tooltip content="Processing hint">
          <Button>Processing</Button>
        </Tooltip>
      </>,
    );
    await findByRole('dialog');

    await user.hover(getByRole('button', { name: 'Processing' }));
    await findByRole('tooltip');
    expect(onOpenChange).toHaveBeenCalledWith({ isOpen: false });
  });

  it('should stay open when it mounts open while another overlay is showing', async () => {
    const user = userEvents.setup();
    const tooltipOnly = (
      <Tooltip content="Processing hint">
        <Button>Processing</Button>
      </Tooltip>
    );
    const { getByRole, findByRole, queryByRole, rerender } = renderWithTheme(tooltipOnly);

    await user.hover(getByRole('button', { name: 'Processing' }));
    await findByRole('tooltip');

    // the group closes every member that is not current; a popover that joins open must not be
    // closed by that before it has taken over (uncontrolled, so nothing but Popover keeps it open)
    rerender(
      withTheme(
        <>
          {tooltipOnly}
          <Popover
            openInteraction="hover"
            defaultIsOpen={true}
            title="Success"
            content={<Text>Success preview</Text>}
          >
            <Button>Success</Button>
          </Popover>
        </>,
      ),
    );
    expect(await findByRole('dialog')).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(queryByRole('dialog')).toBeInTheDocument();
  });
});
