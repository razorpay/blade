import VolumeLowIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<VolumeLowIcon />', () => {
  it('should render VolumeLowIcon', () => {
    const { container } = renderWithTheme(
      <VolumeLowIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
