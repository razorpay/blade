import React from 'react';
import userEvents from '@testing-library/user-event';
import { StepGroup, StepItem, StepItemIndicator, StepItemIcon } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Collapsible, CollapsibleLink, CollapsibleBody } from '~components/Collapsible';
import { Badge } from '~components/Badge';
import { RazorpayIcon } from '~components/Icons';

describe('<StepGroup />', () => {
  it('should render nested StepGroup', () => {
    const { container } = renderWithTheme(
      <StepGroup>
        <StepItem
          title="Introduction"
          timestamp="Thu, 15th Oct"
          description="Header description"
          stepProgress="full"
        />
        <StepItem
          title="Personal Details"
          timestamp="Thu, 15th Oct"
          description="Person Details description"
          stepProgress="full"
        />
        <StepGroup>
          <StepItem
            title="Address"
            timestamp="Thu, 15th Oct"
            stepProgress="start"
            marker={<StepItemIndicator color="positive" />}
          />
          <StepItem
            title="Bank Details"
            timestamp="Thu, 15th Oct"
            description="Person Details description"
          />
        </StepGroup>
      </StepGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render as anchor tag when href is passed', () => {
    const { getByRole } = renderWithTheme(
      <StepGroup>
        <StepItem title="Introduction" href="https://razorpay.com" />
      </StepGroup>,
    );

    expect(getByRole('link', { name: 'Introduction' })).toBeInTheDocument();
  });

  it('should render as button tag when onClick is passed and handle click', async () => {
    const user = userEvents.setup();
    const clickHandler = jest.fn();
    const { getByRole } = renderWithTheme(
      <StepGroup>
        <StepItem title="Introduction" onClick={clickHandler} />
      </StepGroup>,
    );

    const stepItemButton = getByRole('button', { name: 'Introduction' });
    expect(stepItemButton).toBeInTheDocument();
    await user.click(stepItemButton);
    expect(clickHandler).toBeCalledTimes(1);
  });

  it('should use custom minWidth in horizontal orientation when minWidth is provided', () => {
    const { container } = renderWithTheme(
      <StepGroup orientation="horizontal">
        <StepItem title="Introduction" minWidth="200px" />
      </StepGroup>,
    );
    const stepItem = container.querySelector('.step-item');
    expect(stepItem).toHaveStyle({
      minWidth: '200px',
    });
  });

  it('should have a default minWidth in horizontal orientation when minWidth is not provided', () => {
    const { container } = renderWithTheme(
      <StepGroup orientation="horizontal">
        <StepItem title="Introduction" />
      </StepGroup>,
    );
    const stepItem = container.querySelector('.step-item');
    expect(stepItem).toHaveStyle({
      minWidth: 'min(120px,100%)',
    });
  });

  it('should throw an error when trailing is passed in horizontal orientation', () => {
    // hiding error from terminal
    const tempConsoleError = console.error;
    console.error = jest.fn();
    try {
      renderWithTheme(
        <StepGroup orientation="horizontal">
          <StepItem title="Introduction" trailing={<Badge>New</Badge>} />
        </StepGroup>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          '[Blade: StepItem]: trailing is not allowed in horizontal StepGroup',
        );
      }
    }
    console.error = tempConsoleError;
  });

  it('should throw an error when nested StepGroup is defined', () => {
    // hiding error from terminal
    const tempConsoleError = console.error;
    console.error = jest.fn();
    try {
      renderWithTheme(
        <StepGroup orientation="horizontal">
          <StepItem title="Introduction" />
          <StepGroup orientation="horizontal">
            <StepItem title="Introduction" />
          </StepGroup>
        </StepGroup>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          '[Blade: StepItem]: Nested StepGroup components are not allowed in horizontal orientation',
        );
      }
    }
    console.error = tempConsoleError;
  });

  it('should render collapsible step group correctly', async () => {
    const user = userEvents.setup();
    const { getByText, getByRole } = renderWithTheme(
      <StepGroup>
        <StepItem title="Introduction" />
        <StepItem title="Personal Details" />
        <Collapsible>
          <CollapsibleLink>Toggle Show</CollapsibleLink>
          <CollapsibleBody testID="collapsible-body">
            <StepItem title="Business Details" />
            <StepItem title="Needs Response" />
            <StepItem title="Complete Onboarding" />
          </CollapsibleBody>
        </Collapsible>
      </StepGroup>,
    );

    // Initial state - collapsed
    expect(getByText('Introduction')).toBeVisible();
    expect(getByText('Personal Details')).toBeVisible();
    expect(getByText('Toggle Show')).toBeVisible();
    expect(getByText('Business Details')).not.toBeVisible();

    // Click to expand
    await user.click(getByRole('button', { name: 'Toggle Show' }));

    // Expanded state
    expect(getByText('Toggle Show')).toBeVisible();
    expect(getByText('Business Details')).toBeVisible();
  });

  describe('should support adding data-analytics attribute', () => {
    it('should accept data-analytics attribute', () => {
      const { container } = renderWithTheme(
        <StepGroup data-analytics-step-group="StepGroup">
          <StepItem title="Introduction" data-analytics-step-item="Introduction" />
        </StepGroup>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  // ─── Regression tests: icon-label alignment in nested StepGroup ───────────
  describe('nested StepGroup — first-item icon/label alignment', () => {
    /**
     * Bug: StepLineStart applied marginTop=markerTopAlignment (-13px for medium)
     * on the marker box after a StepTopCurveVertical SVG (14px solid / 20px dotted).
     * This placed the marker top at only 1px (solid) from the container, while
     * StepLineVertical / StepLineEnd use a fixed 6px spacer.  The 5–6 px gap
     * caused the icon to appear above the label text.
     *
     * Fix: correctedMarkerTopAlignment = itemTopMargin - curveHeight
     *   solid:  6 - 14 = -8px  → marker top = 6px ✅
     *   dotted: 6 - 20 = -14px → marker top = 6px ✅
     */

    it('should render first nested item (solid curve) with correct snapshot', () => {
      const { container } = renderWithTheme(
        <StepGroup>
          <StepItem title="Disputes Raised" stepProgress="full" />
          <StepItem title="Disputes Under Review" stepProgress="full" />
          <StepGroup>
            <StepItem
              title="Review from Razorpay Team"
              timestamp="Fri, 12th Oct'23 | 12:00pm"
              description="The dispute is reviewed by Razorpay team"
              stepProgress="full"
              marker={<StepItemIcon icon={RazorpayIcon} color="positive" />}
            />
          </StepGroup>
          <StepItem title="Needs Response" />
        </StepGroup>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render first nested item (dotted curve / stepProgress=none) with correct snapshot', () => {
      const { container } = renderWithTheme(
        <StepGroup>
          <StepItem title="Step One" stepProgress="full" />
          <StepGroup>
            <StepItem
              title="Nested First — Dotted"
              stepProgress="none"
              marker={<StepItemIndicator color="neutral" />}
            />
            <StepItem title="Nested Second" stepProgress="none" />
          </StepGroup>
          <StepItem title="Step Three" />
        </StepGroup>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a single-item nested StepGroup with correct snapshot', () => {
      // StepLineSingleItem is used when a nested group contains exactly one item.
      const { container } = renderWithTheme(
        <StepGroup>
          <StepItem title="Parent" stepProgress="full" />
          <StepGroup>
            <StepItem
              title="Only Nested Item"
              stepProgress="full"
              marker={<StepItemIndicator color="positive" />}
            />
          </StepGroup>
          <StepItem title="Sibling" />
        </StepGroup>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should apply corrected marginTop (-8px) on solid-curve first nested item marker', () => {
      /**
       * Before fix: marginTop was -13px (markerTopAlignment for medium/solid).
       * After fix:  marginTop is  -8px (= itemTopMargin(6) - curveHeight(14)).
       * This places the marker top at 6px — matching StepLineVertical.
       */
      const { container } = renderWithTheme(
        <StepGroup>
          <StepItem title="Parent" stepProgress="full" />
          <StepGroup>
            <StepItem
              title="First Nested"
              stepProgress="full"
              marker={<StepItemIndicator color="positive" />}
            />
            <StepItem title="Second Nested" />
          </StepGroup>
        </StepGroup>,
      );

      // .step-nesting-level-1.step-index-0 is the first item in the nested group.
      // Its StepLine renders: [svg curve] [marker-box] [connector-line]
      // The marker-box is the first <div> child after the svg.
      const firstNestedItem = container.querySelector(
        '.step-nesting-level-1.step-index-0',
      );
      expect(firstNestedItem).toBeInTheDocument();

      // The step-line column is the first child div of the step-item row.
      const stepLineColumn = firstNestedItem?.firstElementChild;
      // The marker wrapper is the second child of the step-line column (after the svg).
      const markerBox = stepLineColumn?.querySelector('div:nth-child(2)');
      expect(markerBox).toHaveStyle({ marginTop: '-8px' });
    });

    it('should apply corrected marginTop (-14px) on dotted-curve first nested item marker', () => {
      /**
       * Before fix: marginTop was -13px for dotted curve too (18px marker center — 1px off).
       * After fix:  marginTop is -14px (= itemTopMargin(6) - curveHeight(20)).
       * Marker center = 20 - 14 + 11 = 17px — matching StepLineVertical.
       */
      const { container } = renderWithTheme(
        <StepGroup>
          <StepItem title="Parent" stepProgress="full" />
          <StepGroup>
            <StepItem
              title="First Nested — Dotted"
              stepProgress="none"
              marker={<StepItemIndicator color="neutral" />}
            />
            <StepItem title="Second Nested" />
          </StepGroup>
        </StepGroup>,
      );

      const firstNestedItem = container.querySelector(
        '.step-nesting-level-1.step-index-0',
      );
      const stepLineColumn = firstNestedItem?.firstElementChild;
      const markerBox = stepLineColumn?.querySelector('div:nth-child(2)');
      expect(markerBox).toHaveStyle({ marginTop: '-14px' });
    });

    it('should NOT change marginTop for middle nested items (StepLineVertical)', () => {
      /**
       * Middle items use StepLineVertical with a 6px spacer and NO marginTop on the
       * marker box. The fix must not regress these.
       */
      const { container } = renderWithTheme(
        <StepGroup>
          <StepItem title="Parent" stepProgress="full" />
          <StepGroup>
            <StepItem title="First Nested" stepProgress="full" />
            <StepItem
              title="Middle Nested"
              stepProgress="full"
              marker={<StepItemIndicator color="positive" />}
            />
            <StepItem title="Last Nested" />
          </StepGroup>
        </StepGroup>,
      );

      // step-index-1 is the middle item — uses StepLineVertical (no marginTop fix)
      const middleNestedItem = container.querySelector(
        '.step-nesting-level-1.step-index-1',
      );
      const stepLineColumn = middleNestedItem?.firstElementChild;
      const markerBox = stepLineColumn?.querySelector('div:nth-child(2)');
      // StepLineVertical marker box has no marginTop (only a separate height spacer above)
      expect(markerBox).not.toHaveStyle({ marginTop: '-8px' });
      expect(markerBox).not.toHaveStyle({ marginTop: '-13px' });
    });

    it('should render large-size nested StepGroup with correct alignment snapshot', () => {
      const { container } = renderWithTheme(
        <StepGroup size="large">
          <StepItem title="Parent Step" stepProgress="full" />
          <StepGroup>
            <StepItem
              title="First Nested Large"
              stepProgress="full"
              marker={<StepItemIndicator color="positive" />}
            />
            <StepItem title="Second Nested Large" />
          </StepGroup>
        </StepGroup>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
