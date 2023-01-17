import AlignLeftIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<AlignLeftIcon />', () => {
  it('should render AlignLeftIcon', () => {
    const { container } = renderWithTheme(
      <AlignLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
