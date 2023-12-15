import SunriseIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SunriseIcon />', () => {
  it('should render SunriseIcon', () => {
    const { container } = renderWithTheme(
      <SunriseIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
