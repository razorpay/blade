import ExternalLinkIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ExternalLinkIcon />', () => {
  it('should render ExternalLinkIcon', () => {
    const renderTree = renderWithTheme(
      <ExternalLinkIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
