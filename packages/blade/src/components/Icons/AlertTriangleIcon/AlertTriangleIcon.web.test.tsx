import AlertTriangleIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AlertTriangleIcon />', () => {
  it('should render AlertTriangleIcon', () => {
    const { container } = renderWithTheme(
      <AlertTriangleIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
