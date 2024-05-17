import VolumeLowIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<VolumeLowIcon />', () => {
  it('should render VolumeLowIcon', () => {
    const { container } = renderWithTheme(
      <VolumeLowIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
