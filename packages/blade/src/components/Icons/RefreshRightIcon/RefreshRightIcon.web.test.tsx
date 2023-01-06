import RefreshRightIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RefreshRightIcon />', () => {
  it('should render RefreshRightIcon', () => {
    const { container } = renderWithTheme(
      <RefreshRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
