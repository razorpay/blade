import { useState } from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ProgressBar } from '../ProgressBar';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Button } from '~components/Button';

const colors = ['information', 'negative', 'neutral', 'notice', 'positive'] as const;

describe('<ProgressBar />', () => {
  it('should render ProgressBar with default props', () => {
    const { toJSON } = renderWithTheme(<ProgressBar label="Label" value={20} />);
    expect(toJSON()).toMatchSnapshot();
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
    const { toJSON, getByText } = renderWithTheme(<UpdatingProgressBar />);
    const updateProgressButton = getByText(/update progress/i);
    expect(toJSON()).toMatchSnapshot();
    fireEvent.press(updateProgressButton);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render small size ProgressBar', () => {
    const { toJSON } = renderWithTheme(<ProgressBar label="Label" size="small" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size ProgressBar', () => {
    const { toJSON } = renderWithTheme(<ProgressBar label="Label" size="medium" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render ProgressBar without label and percentage', () => {
    const { toJSON } = renderWithTheme(<ProgressBar showPercentage={false} value={50} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render meter variant of ProgressBar ', () => {
    const { toJSON } = renderWithTheme(<ProgressBar value={70} variant="meter" />);
    expect(toJSON()).toMatchSnapshot();
  });

  colors.forEach((color) => {
    it(`should render color=${color} ProgressBar`, () => {
      const { toJSON } = renderWithTheme(<ProgressBar color={color} value={20} />);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should have accessibility attributes for progress variant', () => {
    const { getByRole } = renderWithTheme(
      <ProgressBar label="Label" accessibilityLabel="Downloading" value={70} variant="progress" />,
    );

    const progressbar = getByRole('progressbar');
    expect(progressbar.findByProps({ accessibilityLabel: 'Downloading' })).toBeTruthy();
    expect(progressbar).toHaveAccessibilityValue({
      max: 100,
      min: 0,
      now: 70,
      text: '70%',
    });
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

    const progressbar = getByRole('progressbar');
    expect(progressbar.findByProps({ accessibilityLabel: 'Checking' })).toBeTruthy();
    expect(progressbar).toHaveAccessibilityValue({
      max: undefined,
      min: undefined,
      now: undefined,
      text: undefined,
    });
  });

  it('should have accessibility attributes for meter variant', () => {
    const { getByRole } = renderWithTheme(
      <ProgressBar label="Label" accessibilityLabel="Amount" value={70} variant="meter" />,
    );

    const progressbar = getByRole('progressbar');
    expect(progressbar.findByProps({ accessibilityLabel: 'Amount' })).toBeTruthy();
    expect(progressbar).toHaveAccessibilityValue({
      max: 100,
      min: 0,
      now: 70,
      text: '70',
    });
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
