import SunriseIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SunriseIcon />', () => {
  it('should render SunriseIcon', () => {
    const { container } = renderWithTheme(
      <SunriseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
