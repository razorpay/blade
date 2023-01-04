import VolumeXIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<VolumeXIcon />', () => {
  it('should render VolumeXIcon', () => {
    const { container } = renderWithTheme(
      <VolumeXIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
