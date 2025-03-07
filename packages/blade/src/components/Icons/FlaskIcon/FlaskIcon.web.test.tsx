import FlaskIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FlaskIcon />', () => {
  it('should render FlaskIcon', () => {
    const { container } = renderWithTheme(
      <FlaskIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
