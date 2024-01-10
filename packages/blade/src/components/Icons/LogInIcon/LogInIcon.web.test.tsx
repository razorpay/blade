import LogInIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<LogInIcon />', () => {
  it('should render LogInIcon', () => {
    const { container } = renderWithTheme(
      <LogInIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
