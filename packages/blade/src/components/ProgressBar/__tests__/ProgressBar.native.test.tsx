import { ProgressBar } from '../ProgressBar';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import assertAccessible from '~src/_helpers/testing/assertAccessible.native';

describe('<ProgressBar />', () => {
  it('should render ProgressBar with default props', () => {
    const { toJSON } = renderWithTheme(<ProgressBar label="Label" value={20} />);
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
    const { toJSON } = renderWithTheme(<ProgressBar hidePercentage={true} value={50} />);
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

  it('should have accessibilityLabel', () => {
    const { getByRole } = renderWithTheme(
      <ProgressBar label="Label" accessibilityLabel="Downloading" value={70} />,
    );

    expect(getByRole('progressbar')).toHaveAccessibleName('Downloading');
  });

  it('should not have accessibility violations', async () => {
    const { toJSON } = renderWithTheme(<ProgressBar accessibilityLabel="Downloading" value={70} />);
    await assertAccessible(container);
  });
});
