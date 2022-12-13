import { useState } from 'react';
import { ProgressBar } from '../ProgressBar';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';
import { Button } from '~components/Button';

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
    const { container } = renderWithTheme(<ProgressBar hidePercentage={true} value={50} />);
    expect(container).toMatchSnapshot();
  });

  it('should render meter variant of ProgressBar ', () => {
    const { container, getByRole } = renderWithTheme(<ProgressBar value={70} variant="meter" />);
    expect(container).toMatchSnapshot();
    expect(getByRole('meter')).toBeTruthy();
  });

  it('should render high contrast ProgressBar', () => {
    const { container } = renderWithTheme(<ProgressBar contrast="high" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast positive intent ProgressBar', () => {
    const { container } = renderWithTheme(
      <ProgressBar intent="positive" contrast="low" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast positive intent ProgressBar', () => {
    const { container } = renderWithTheme(
      <ProgressBar intent="positive" contrast="high" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast negative intent ProgressBar', () => {
    const { container } = renderWithTheme(
      <ProgressBar intent="negative" contrast="low" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast negative intent ProgressBar', () => {
    const { container } = renderWithTheme(
      <ProgressBar intent="negative" contrast="high" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast notice intent ProgressBar', () => {
    const { container } = renderWithTheme(
      <ProgressBar intent="notice" contrast="low" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast notice intent ProgressBar', () => {
    const { container } = renderWithTheme(
      <ProgressBar intent="notice" contrast="high" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast information intent ProgressBar', () => {
    const { container } = renderWithTheme(
      <ProgressBar intent="information" contrast="low" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast information intent ProgressBar', () => {
    const { container } = renderWithTheme(
      <ProgressBar intent="information" contrast="high" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast neutral intent ProgressBar', () => {
    const { container } = renderWithTheme(
      <ProgressBar intent="neutral" contrast="low" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast neutral intent ProgressBar', () => {
    const { container } = renderWithTheme(
      <ProgressBar intent="neutral" contrast="high" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should have accessibilityLabel', () => {
    const { getByRole } = renderWithTheme(
      <ProgressBar label="Label" accessibilityLabel="Downloading" value={70} />,
    );

    expect(getByRole('progressbar')).toHaveAccessibleName('Downloading');
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
      <ProgressBar accessibilityLabel="Downloading" value={70} />,
    );
    await assertAccessible(container);
  });

  it('should throw an error when the variant is meter and isIndeterminate is set', () => {
    try {
      // @ts-expect-error testing failure case when the variant is meter and isIndeterminate is set
      renderWithTheme(<ProgressBar variant="meter" isIndeterminate={true} />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          `[Blade: ProgressBar]: Cannot set 'isIndeterminate' when 'variant' is 'meter'.`,
        );
      }
    }
  });

  it('should throw an error when the variant is meter and hidePercentage is set', () => {
    try {
      // @ts-expect-error testing failure case when the variant is meter and hidePercentage is set
      renderWithTheme(<ProgressBar variant="meter" hidePercentage={true} />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          `[Blade: ProgressBar]: Cannot set 'hidePercentage' when 'variant' is 'meter'. Percentage is always hidden for meter.`,
        );
      }
    }
  });
});
