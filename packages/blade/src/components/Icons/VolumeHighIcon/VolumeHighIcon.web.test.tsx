import VolumeHighIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<VolumeHighIcon />', () => {
  it('should render VolumeHighIcon', () => {
    const { container } = renderWithTheme(
      <VolumeHighIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
