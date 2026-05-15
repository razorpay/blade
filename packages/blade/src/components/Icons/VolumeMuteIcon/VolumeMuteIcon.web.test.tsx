import renderWithTheme from '~utils/testing/renderWithTheme.web';

import VolumeMuteIcon from './';

describe('<VolumeMuteIcon />', () => {
  it('should render VolumeMuteIcon', () => {
    const { container } = renderWithTheme(
      <VolumeMuteIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
