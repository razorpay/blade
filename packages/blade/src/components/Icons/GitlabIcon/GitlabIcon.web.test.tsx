import GitlabIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<GitlabIcon />', () => {
  it('should render GitlabIcon', () => {
    const { container } = renderWithTheme(
      <GitlabIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
