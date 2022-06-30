import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import EditIcon from '.';

describe('<EditIcon />', () => {
  it('should render EditIcon', () => {
    const { container } = renderWithTheme(
      <EditIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
