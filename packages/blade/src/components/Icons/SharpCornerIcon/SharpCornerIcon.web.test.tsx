import SharpCornerIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SharpCornerIcon />', () => {
  it('should render SharpCornerIcon', () => {
    const { container } = renderWithTheme(
      <SharpCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
