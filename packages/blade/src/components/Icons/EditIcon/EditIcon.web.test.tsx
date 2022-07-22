import EditIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<EditIcon />', () => {
  it('should render EditIcon', () => {
    const { container } = renderWithTheme(
      <EditIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
