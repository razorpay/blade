import LogInIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<LogInIcon />', () => {
  it('should render LogInIcon', () => {
    const { container } = renderWithTheme(
      <LogInIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
