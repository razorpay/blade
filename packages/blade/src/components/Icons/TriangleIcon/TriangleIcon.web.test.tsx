import TriangleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TriangleIcon />', () => {
  it('should render TriangleIcon', () => {
    const { container } = renderWithTheme(
      <TriangleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
