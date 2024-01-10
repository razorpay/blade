import GitlabIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<GitlabIcon />', () => {
  it('should render GitlabIcon', () => {
    const { container } = renderWithTheme(
      <GitlabIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
