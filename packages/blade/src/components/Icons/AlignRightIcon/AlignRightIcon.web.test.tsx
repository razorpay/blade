import AlignRightIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AlignRightIcon />', () => {
  it('should render AlignRightIcon', () => {
    const { container } = renderWithTheme(
      <AlignRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
