import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { StepGroup, StepItem, StepItemIndicator } from '../';
import { markerLineHorizontalLength } from '../tokens';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Badge } from '~components/Badge';
import { size as sizeTokens } from '~tokens/global';
import { Collapsible, CollapsibleBody, CollapsibleLink } from '~components/Collapsible';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<StepGroup /> (native)', () => {
  it('should render nested StepGroup', () => {
    const { toJSON } = renderWithTheme(
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
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with default props', () => {
    const { toJSON } = renderWithTheme(
      <StepGroup>
        <StepItem title="Step 1" />
        <StepItem title="Step 2" />
      </StepGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle onPress when onClick is passed', () => {
    const clickHandler = jest.fn();
    const { getByText } = renderWithTheme(
      <StepGroup>
        <StepItem title="Introduction" onClick={clickHandler} />
      </StepGroup>,
    );

    fireEvent.press(getByText('Introduction'));
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('should NOT fire onPress when disabled', () => {
    const clickHandler = jest.fn();
    const { getByText } = renderWithTheme(
      <StepGroup>
        <StepItem title="Introduction" onClick={clickHandler} isDisabled />
      </StepGroup>,
    );

    fireEvent.press(getByText('Introduction'));
    expect(clickHandler).not.toHaveBeenCalled();
  });

  it('should render horizontal orientation', () => {
    const { toJSON } = renderWithTheme(
      <StepGroup orientation="horizontal">
        <StepItem title="Step 1" stepProgress="full" />
        <StepItem title="Step 2" stepProgress="start" />
        <StepItem title="Step 3" />
      </StepGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large size', () => {
    const { toJSON } = renderWithTheme(
      <StepGroup size="large">
        <StepItem
          title="Step 1"
          timestamp="Thu, 15th Oct"
          description="Description"
          stepProgress="full"
          marker={<StepItemIndicator color="positive" />}
        />
        <StepItem title="Step 2" />
      </StepGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should throw an error when trailing is passed in horizontal orientation', () => {
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

  it('should throw an error when nested StepGroup is defined in horizontal', () => {
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

  it('should render with trailing badge', () => {
    const { toJSON } = renderWithTheme(
      <StepGroup>
        <StepItem title="Step 1" trailing={<Badge>New</Badge>} stepProgress="full" />
        <StepItem title="Step 2" />
      </StepGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should support data-analytics attributes', () => {
    const { toJSON } = renderWithTheme(
      <StepGroup data-analytics-step-group="StepGroup">
        <StepItem title="Introduction" data-analytics-step-item="Introduction" />
      </StepGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should force the CollapsibleBody to full width so nested StepItems can fill the row', () => {
    // Collapsible aligns children to the start, so without an explicit width the body
    // shrink-wraps and StepItem's `width: '100%'` header collapses to 0 (only markers show).
    // StepGroup injects width="100%" onto the CollapsibleBody to prevent this.
    const { getByTestId } = renderWithTheme(
      <StepGroup>
        <StepItem title="Introduction" />
        <Collapsible>
          <CollapsibleLink>Show</CollapsibleLink>
          <CollapsibleBody testID="step-collapsible-body">
            <StepItem title="Business Details" />
            <StepItem title="Complete Onboarding" />
          </CollapsibleBody>
        </Collapsible>
      </StepGroup>,
    );

    const collapsibleBody = getByTestId('step-collapsible-body');
    const flattenedStyle = Array.isArray(collapsibleBody.props.style)
      ? Object.assign({}, ...collapsibleBody.props.style)
      : collapsibleBody.props.style;
    expect(flattenedStyle.width).toBe('100%');
  });

  describe('markerLineHorizontalLength token', () => {
    it('should be a fixed length that is roughly half the horizontal item width', () => {
      // Horizontal StepItem uses a definite width of sizeTokens['160'] and each item
      // renders a connector segment on each side of the marker. Two segments should
      // roughly span one item width so adjacent connectors read as a continuous line.
      const horizontalItemWidth = sizeTokens['160'];

      expect(markerLineHorizontalLength).toBe(sizeTokens['72']);
      expect(markerLineHorizontalLength * 2).toBeGreaterThan(horizontalItemWidth * 0.75);
      expect(markerLineHorizontalLength * 2).toBeLessThanOrEqual(horizontalItemWidth);
    });
  });
});
