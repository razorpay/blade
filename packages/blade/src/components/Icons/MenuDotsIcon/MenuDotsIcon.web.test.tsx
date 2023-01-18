import MenuDotsIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MenuDotsIcon />', () => {
  it('should render MenuDotsIcon', () => {
    const { container } = renderWithTheme(
      <MenuDotsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
