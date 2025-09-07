import VolumeOnIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<VolumeOnIcon />', () => {
  it('should render VolumeOnIcon', () => {
    const { container } = renderWithTheme(
      <VolumeOnIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
