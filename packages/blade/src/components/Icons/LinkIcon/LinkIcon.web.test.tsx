import LinkIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<LinkIcon />', () => {
  it('should render LinkIcon', () => {
    const { container } = renderWithTheme(
      <LinkIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
