import DeleteIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<DeleteIcon />', () => {
  it('should render DeleteIcon', () => {
    const { container } = renderWithTheme(
      <DeleteIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
