import CropIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CropIcon />', () => {
  it('should render CropIcon', () => {
    const { container } = renderWithTheme(
      <CropIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
