import ExternalLinkIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ExternalLinkIcon />', () => {
  it('should render ExternalLinkIcon', () => {
    const renderTree = renderWithTheme(
      <ExternalLinkIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
