import AnchorIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AnchorIcon />', () => {
  it('should render AnchorIcon', () => {
    const { container } = renderWithTheme(
      <AnchorIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
