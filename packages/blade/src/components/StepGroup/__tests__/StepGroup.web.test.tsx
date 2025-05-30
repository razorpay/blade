import React from 'react';
import userEvents from '@testing-library/user-event';
import { StepGroup, StepItem, StepItemIndicator } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Collapsible, CollapsibleLink, CollapsibleBody } from '~components/Collapsible';
import { Badge } from '~components/Badge';

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
});
