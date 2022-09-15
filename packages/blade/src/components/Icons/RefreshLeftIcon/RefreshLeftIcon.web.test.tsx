import RefreshLeftIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RefreshLeftIcon />', () => {
  it('should render RefreshLeftIcon', () => {
    const { container } = renderWithTheme(
      <RefreshLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
