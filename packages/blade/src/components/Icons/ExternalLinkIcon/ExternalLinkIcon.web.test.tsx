import ExternalLinkIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ExternalLinkIcon />', () => {
  it('should render ExternalLinkIcon', () => {
    const { container } = renderWithTheme(
      <ExternalLinkIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
