import SunsetIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SunsetIcon />', () => {
  it('should render SunsetIcon', () => {
    const { container } = renderWithTheme(
      <SunsetIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
