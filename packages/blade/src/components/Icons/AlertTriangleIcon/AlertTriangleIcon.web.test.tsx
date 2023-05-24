import AlertTriangleIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AlertTriangleIcon />', () => {
  it('should render AlertTriangleIcon', () => {
    const { container } = renderWithTheme(
      <AlertTriangleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
