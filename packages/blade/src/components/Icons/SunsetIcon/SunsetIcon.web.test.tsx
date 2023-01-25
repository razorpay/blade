import SunsetIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SunsetIcon />', () => {
  it('should render SunsetIcon', () => {
    const { container } = renderWithTheme(
      <SunsetIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
