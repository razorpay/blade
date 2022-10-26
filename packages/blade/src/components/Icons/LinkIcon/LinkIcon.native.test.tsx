import LinkIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<LinkIcon />', () => {
  it('should render LinkIcon', () => {
    const renderTree = renderWithTheme(
      <LinkIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
