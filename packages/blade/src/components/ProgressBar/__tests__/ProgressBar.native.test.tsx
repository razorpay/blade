import { useState } from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ProgressBar } from '../ProgressBar';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import { Button } from '~components/Button';

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

  it('should render high contrast ProgressBar', () => {
    const { toJSON } = renderWithTheme(<ProgressBar contrast="high" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast positive intent ProgressBar', () => {
    const { toJSON } = renderWithTheme(<ProgressBar intent="positive" contrast="low" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast positive intent ProgressBar', () => {
    const { toJSON } = renderWithTheme(
      <ProgressBar intent="positive" contrast="high" value={20} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast negative intent ProgressBar', () => {
    const { toJSON } = renderWithTheme(<ProgressBar intent="negative" contrast="low" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast negative intent ProgressBar', () => {
    const { toJSON } = renderWithTheme(
      <ProgressBar intent="negative" contrast="high" value={20} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast notice intent ProgressBar', () => {
    const { toJSON } = renderWithTheme(<ProgressBar intent="notice" contrast="low" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast notice intent ProgressBar', () => {
    const { toJSON } = renderWithTheme(<ProgressBar intent="notice" contrast="high" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast information intent ProgressBar', () => {
    const { toJSON } = renderWithTheme(
      <ProgressBar intent="information" contrast="low" value={20} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast information intent ProgressBar', () => {
    const { toJSON } = renderWithTheme(
      <ProgressBar intent="information" contrast="high" value={20} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast neutral intent ProgressBar', () => {
    const { toJSON } = renderWithTheme(<ProgressBar intent="neutral" contrast="low" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast neutral intent ProgressBar', () => {
    const { toJSON } = renderWithTheme(<ProgressBar intent="neutral" contrast="high" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should have accessibility attributes for progress variant', () => {
    const { getByRole, getByA11yValue } = renderWithTheme(
      <ProgressBar label="Label" accessibilityLabel="Downloading" value={70} variant="progress" />,
    );

    const progressbar = getByRole('progressbar');
    expect(progressbar.findByProps({ accessibilityLabel: 'Downloading' })).toBeTruthy();
    expect(
      getByA11yValue({
        max: 100,
        min: 0,
        now: 70,
        text: '70%',
      }),
    ).toBeTruthy();
  });

  it('should have the right accessibility attributes for progress variant in indeterminate state', () => {
    const { getByRole, getByA11yValue } = renderWithTheme(
      <ProgressBar
        label="Label"
        accessibilityLabel="Checking"
        isIndeterminate={true}
        variant="progress"
      />,
    );

    const progressbar = getByRole('progressbar');
    expect(progressbar.findByProps({ accessibilityLabel: 'Checking' })).toBeTruthy();
    expect(
      getByA11yValue({
        max: undefined,
        min: undefined,
        now: undefined,
        text: undefined,
      }),
    ).toBeTruthy();
  });

  it('should have accessibility attributes for meter variant', () => {
    const { getByRole, findByA11yValue } = renderWithTheme(
      <ProgressBar label="Label" accessibilityLabel="Amount" value={70} variant="meter" />,
    );

    const progressbar = getByRole('progressbar');
    expect(progressbar.findByProps({ accessibilityLabel: 'Amount' })).toBeTruthy();
    expect(
      findByA11yValue({
        max: 100,
        min: 0,
        now: 70,
        text: '70',
      }),
    ).toBeTruthy();
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
