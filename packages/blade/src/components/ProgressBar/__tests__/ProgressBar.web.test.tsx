import { useState } from 'react';
import { ProgressBar } from '../ProgressBar';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Button } from '~components/Button';

const colors = ['information', 'negative', 'neutral', 'notice', 'positive'] as const;

describe('<ProgressBar />', () => {
  it('should render ProgressBar with default props', () => {
    const { container } = renderWithTheme(<ProgressBar label="Label" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should update the progress value appropriately', () => {
    const UpdatingProgressBar = (): React.ReactElement => {
      const [progressValue, setProgressValue] = useState(0);
      return (
        <>
          <Button onClick={(): void => setProgressValue(60)}>Update Progress</Button>
          <ProgressBar label="Label" value={progressValue} />
        </>
      );
    };
    const { container, getByText } = renderWithTheme(<UpdatingProgressBar />);
    const updateProgressButton = getByText(/update progress/i);
    expect(container).toMatchSnapshot();
    updateProgressButton.click();
    expect(container).toMatchSnapshot();
  });

  it('should render small size ProgressBar', () => {
    const { container } = renderWithTheme(<ProgressBar label="Label" size="small" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size ProgressBar', () => {
    const { container } = renderWithTheme(<ProgressBar label="Label" size="medium" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render ProgressBar without label and percentage', () => {
    const { container } = renderWithTheme(<ProgressBar showPercentage={false} value={50} />);
    expect(container).toMatchSnapshot();
  });

  it('should render meter variant of ProgressBar ', () => {
    const { container, getByRole } = renderWithTheme(<ProgressBar value={70} variant="meter" />);
    expect(container).toMatchSnapshot();
    expect(getByRole('meter')).toBeTruthy();
  });

  colors.forEach((color) => {
    it(`should render color=${color} ProgressBar`, () => {
      const { container } = renderWithTheme(<ProgressBar color={color} value={20} />);
      expect(container).toMatchSnapshot();
    });
  });

  it('should have the right accessibility attributes for progress variant', () => {
    const { getByRole } = renderWithTheme(
      <ProgressBar label="Label" accessibilityLabel="Downloading" value={70} variant="progress" />,
    );

    expect(getByRole('progressbar')).toHaveAccessibleName('Downloading');
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '70');
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0');
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuetext', '70%');
  });

  it('should have the right accessibility attributes for progress variant in indeterminate state', () => {
    const { getByRole } = renderWithTheme(
      <ProgressBar
        label="Label"
        accessibilityLabel="Checking"
        isIndeterminate={true}
        variant="progress"
      />,
    );

    expect(getByRole('progressbar')).toHaveAccessibleName('Checking');
    expect(getByRole('progressbar').getAttribute('aria-valuenow')).toBeNull();
    expect(getByRole('progressbar').getAttribute('aria-valuemin')).toBeNull();
    expect(getByRole('progressbar').getAttribute('aria-valuemax')).toBeNull();
    expect(getByRole('progressbar').getAttribute('aria-valuetext')).toBeNull();
  });

  it('should have the right accessibility attributes for meter variant', () => {
    const { getByRole } = renderWithTheme(
      <ProgressBar label="Label" accessibilityLabel="Amount" value={70} variant="meter" />,
    );

    expect(getByRole('meter')).toHaveAccessibleName('Amount');
    expect(getByRole('meter')).toHaveAttribute('aria-valuenow', '70');
    expect(getByRole('meter')).toHaveAttribute('aria-valuemin', '0');
    expect(getByRole('meter')).toHaveAttribute('aria-valuemax', '100');
    expect(getByRole('meter')).toHaveAttribute('aria-valuetext', '70');
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
      <ProgressBar accessibilityLabel="Downloading" value={70} />,
    );
    await assertAccessible(container);
  });

  it('should throw an error when the variant is meter and isIndeterminate is set', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    // @ts-expect-error testing failure case when the variant is meter and isIndeterminate is set
    expect(() => renderWithTheme(<ProgressBar variant="meter" isIndeterminate={true} />)).toThrow(
      `[Blade: ProgressBar]: Cannot set 'isIndeterminate' when 'variant' is 'meter'.`,
    );
    mockConsoleError.mockRestore();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <ProgressBar label="Label" value={20} testID="progress-bar-test" />,
    );
    expect(getByTestId('progress-bar-test')).toBeTruthy();
  });
});
