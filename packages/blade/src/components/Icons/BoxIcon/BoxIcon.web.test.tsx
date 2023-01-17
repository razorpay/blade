import BoxIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BoxIcon />', () => {
  it('should render BoxIcon', () => {
    const { container } = renderWithTheme(
      <BoxIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
