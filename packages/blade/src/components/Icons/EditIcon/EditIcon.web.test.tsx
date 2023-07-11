import EditIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<EditIcon />', () => {
  it('should render EditIcon', () => {
    const { container } = renderWithTheme(
      <EditIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
