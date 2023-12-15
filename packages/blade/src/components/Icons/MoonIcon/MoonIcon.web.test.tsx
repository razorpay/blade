import MoonIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MoonIcon />', () => {
  it('should render MoonIcon', () => {
    const { container } = renderWithTheme(
      <MoonIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
