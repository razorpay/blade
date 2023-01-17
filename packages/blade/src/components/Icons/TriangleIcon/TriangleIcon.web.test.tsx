import TriangleIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<TriangleIcon />', () => {
  it('should render TriangleIcon', () => {
    const { container } = renderWithTheme(
      <TriangleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
