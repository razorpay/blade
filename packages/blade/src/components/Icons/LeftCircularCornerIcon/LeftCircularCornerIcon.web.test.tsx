import LeftCircularCornerIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<LeftCircularCornerIcon />', () => {
  it('should render LeftCircularCornerIcon', () => {
    const { container } = renderWithTheme(
      <LeftCircularCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
