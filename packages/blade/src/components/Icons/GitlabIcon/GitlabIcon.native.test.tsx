import GitlabIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<GitlabIcon />', () => {
  it('should render GitlabIcon', () => {
    const renderTree = renderWithTheme(
      <GitlabIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
