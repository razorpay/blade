import { useState } from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ProgressBar } from '../ProgressBar';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Button } from '~components/Button';

const colors = ['information', 'negative', 'neutral', 'notice', 'positive'] as const;
const variants = ['linear', 'circular'] as const;
const sizes = ['small', 'medium', 'large'] as const;
const types = ['progress', 'meter'] as const;

describe('<ProgressBar />', () => {
  variants.forEach((variant) => {
    it(`should render ${variant} variant ProgressBar with default props`, () => {
      const { toJSON } = renderWithTheme(
        <ProgressBar label="Label" value={20} variant={variant} />,
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('should update the progress value appropriately', () => {
      const UpdatingProgressBar = (): React.ReactElement => {
        const [progressValue, setProgressValue] = useState(0);
        return (
          <>
            <Button onClick={(): void => setProgressValue(60)}>Update Progress</Button>
            <ProgressBar variant={variant} label="Label" value={progressValue} />
          </>
        );
      };
      const { toJSON, getByText } = renderWithTheme(<UpdatingProgressBar />);
      const updateProgressButton = getByText(/update progress/i);
      expect(toJSON()).toMatchSnapshot();
      fireEvent.press(updateProgressButton);
      expect(toJSON()).toMatchSnapshot();
    });

    sizes.forEach((size) => {
      if (size === 'large' && variant === 'linear') {
        it(`should throw error for ${variant} variant ProgressBar with ${size} size`, () => {
          expect(() =>
            renderWithTheme(<ProgressBar label="Label" size={size} value={20} variant={variant} />),
          ).toThrowErrorMatchingInlineSnapshot(
            `"[Blade: ProgressBar]: Large size isn't available when 'variant' is 'linear'."`,
          );
        });
      } else {
        it(`should render ${variant} variant ProgressBar with ${size} size`, () => {
          const { toJSON } = renderWithTheme(
            <ProgressBar label="Label" size={size} value={20} variant={variant} />,
          );
          expect(toJSON()).toMatchSnapshot();
        });
      }
    });

    it('should render ProgressBar without label and percentage', () => {
      const { toJSON } = renderWithTheme(
        <ProgressBar variant={variant} showPercentage={false} value={50} />,
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('should render meter variant of ProgressBar ', () => {
      const { toJSON } = renderWithTheme(<ProgressBar variant={variant} value={70} type="meter" />);
      expect(toJSON()).toMatchSnapshot();
    });

    colors.forEach((color) => {
      it(`should render color=${color} ProgressBar`, () => {
        const { toJSON } = renderWithTheme(<ProgressBar color={color} value={20} />);
        expect(toJSON()).toMatchSnapshot();
      });
    });

    types.forEach((type) => {
      it(`should have the right accessibility attributes for "${type}" type ProgressBar`, () => {
        const { getByRole } = renderWithTheme(
          <ProgressBar
            label="Label"
            accessibilityLabel="Amount"
            value={70}
            variant={variant}
            type={type}
          />,
        );

        const progressbar = getByRole('progressbar');

        expect(progressbar.findByProps({ accessibilityLabel: 'Amount' })).toBeTruthy();

        if (type === 'progress') {
          expect(progressbar).toHaveAccessibilityValue({
            max: undefined,
            min: undefined,
            now: undefined,
            text: undefined,
          });
        } else {
          expect(progressbar).toHaveAccessibilityValue({
            max: 100,
            min: 0,
            now: 70,
            text: '70',
          });
        }
      });
    });
  });

  it('should have the right accessibility attributes for progress variant in indeterminate state', () => {
    const { getByRole } = renderWithTheme(
      <ProgressBar
        label="Label"
        accessibilityLabel="Checking"
        isIndeterminate={true}
        type="progress"
        variant="linear"
      />,
    );

    const progressbar = getByRole('progressbar');
    expect(progressbar.findByProps({ accessibilityLabel: 'Checking' })).toBeTruthy();
    expect(progressbar).toHaveAccessibilityValue({
      max: undefined,
      min: undefined,
      now: undefined,
      text: undefined,
    });
  });

  it('should throw an error when type="meter" and isIndeterminate is set', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() => renderWithTheme(<ProgressBar type="meter" isIndeterminate={true} />)).toThrow(
      `[Blade: ProgressBar]: Cannot set 'isIndeterminate' when 'type' or 'variant' is 'meter'.`,
    );
    mockConsoleError.mockRestore();
  });

  it('should throw an error when variant="meter" and isIndeterminate is set', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    // @ts-expect-error testing failure case when the variant is meter and isIndeterminate is set
    expect(() => renderWithTheme(<ProgressBar variant="meter" isIndeterminate={true} />)).toThrow(
      `[Blade: ProgressBar]: Cannot set 'isIndeterminate' when 'type' or 'variant' is 'meter'.`,
    );
    mockConsoleError.mockRestore();
  });

  it('should throw an error when the variant is circular and isIndeterminate is set', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(<ProgressBar variant="circular" isIndeterminate={true} />),
    ).toThrow(`[Blade: ProgressBar]: Cannot set 'isIndeterminate' when 'variant' is 'circular'.`);
    mockConsoleError.mockRestore();
  });

  types.forEach((type) => {
    (['meter', 'progress'] as const).forEach((variant) => {
      it(`should throw an error when the type is ${type} and variant is ${variant}`, () => {
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
        expect(() => renderWithTheme(<ProgressBar type={type} variant={variant} />)).toThrow(
          `[Blade: ProgressBar]: variant can only be 'linear' or 'circular' when 'type=${type}'.`,
        );
        mockConsoleError.mockRestore();
      });
    });
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <ProgressBar label="Label" value={20} testID="progress-bar-test" />,
    );
    expect(getByTestId('progress-bar-test')).toBeTruthy();
  });
});
