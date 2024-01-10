import BoxIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BoxIcon />', () => {
  it('should render BoxIcon', () => {
    const { container } = renderWithTheme(
      <BoxIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
