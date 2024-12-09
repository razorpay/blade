import { useState } from 'react';
import { ProgressBar } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Button } from '~components/Button';

const colors = ['information', 'negative', 'neutral', 'notice', 'positive'] as const;
const variants = ['linear', 'circular'] as const;
const sizes = ['small', 'medium', 'large'] as const;
const types = ['progress', 'meter'] as const;

describe('<ProgressBar />', () => {
  variants.forEach((variant) => {
    it(`should render ${variant} variant ProgressBar with default props`, () => {
      const { container } = renderWithTheme(
        <ProgressBar label="Label" value={20} variant={variant} />,
      );
      expect(container).toMatchSnapshot();
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
      const { container, getByText } = renderWithTheme(<UpdatingProgressBar />);
      const updateProgressButton = getByText(/update progress/i);
      expect(container).toMatchSnapshot();
      updateProgressButton.click();
      expect(container).toMatchSnapshot();
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
          const { container } = renderWithTheme(
            <ProgressBar label="Label" size={size} value={20} variant={variant} />,
          );
          expect(container).toMatchSnapshot();
        });
      }
    });

    it('should render ProgressBar without label and percentage', () => {
      const { container } = renderWithTheme(
        <ProgressBar variant={variant} showPercentage={false} value={50} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render meter variant of ProgressBar ', () => {
      const { container, getByRole } = renderWithTheme(
        <ProgressBar variant={variant} value={70} type="meter" />,
      );
      expect(container).toMatchSnapshot();
      expect(getByRole('meter')).toBeTruthy();
    });

    it('should render meter variant of ProgressBar with decimal value', () => {
      const { getByRole } = renderWithTheme(
        <ProgressBar variant={variant} value={0.1} type="meter" label="Downloading" />,
      );

      expect(getByRole('meter')).toHaveAttribute('aria-valuetext', '0.1');
    });

    colors.forEach((color) => {
      it(`should render color=${color} ProgressBar`, () => {
        const { container } = renderWithTheme(<ProgressBar color={color} value={20} />);
        expect(container).toMatchSnapshot();
      });
    });

    types.forEach((type) => {
      it(`should have the right accessibility attributes for "${type}" type for ${variant} ProgressBar`, () => {
        const { getByRole } = renderWithTheme(
          <ProgressBar
            label="Label"
            accessibilityLabel="Downloading"
            value={70}
            variant={variant}
            type={type}
          />,
        );

        const role = type === 'progress' ? 'progressbar' : 'meter';
        const valueText = type === 'progress' ? '70%' : '70';

        expect(getByRole(role)).toHaveAccessibleName('Downloading');
        expect(getByRole(role)).toHaveAttribute('aria-valuenow', '70');
        expect(getByRole(role)).toHaveAttribute('aria-valuemin', '0');
        expect(getByRole(role)).toHaveAttribute('aria-valuemax', '100');
        expect(getByRole(role)).toHaveAttribute('aria-valuetext', valueText);
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

    expect(getByRole('progressbar')).toHaveAccessibleName('Checking');
    expect(getByRole('progressbar').getAttribute('aria-valuenow')).toBeNull();
    expect(getByRole('progressbar').getAttribute('aria-valuemin')).toBeNull();
    expect(getByRole('progressbar').getAttribute('aria-valuemax')).toBeNull();
    expect(getByRole('progressbar').getAttribute('aria-valuetext')).toBeNull();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
      <ProgressBar accessibilityLabel="Downloading" value={70} />,
    );
    await assertAccessible(container);
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

  it('should accept data-analytics attribute', () => {
    const { container } = renderWithTheme(
      <ProgressBar label="Label" value={20} data-analytics-progress-value="20" />,
    );
    expect(container).toMatchSnapshot();
  });
});
