import VolumeHighIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<VolumeHighIcon />', () => {
  it('should render VolumeHighIcon', () => {
    const { container } = renderWithTheme(
      <VolumeHighIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
