import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { StepGroup, StepItem, StepItemIndicator } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Badge } from '~components/Badge';

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
});
