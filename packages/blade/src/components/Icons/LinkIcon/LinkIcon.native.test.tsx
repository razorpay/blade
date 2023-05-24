import LinkIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<LinkIcon />', () => {
  it('should render LinkIcon', () => {
    const renderTree = renderWithTheme(
      <LinkIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
