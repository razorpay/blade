import AlignLeftIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AlignLeftIcon />', () => {
  it('should render AlignLeftIcon', () => {
    const { container } = renderWithTheme(
      <AlignLeftIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
