import renderWithTheme from '~utils/testing/renderWithTheme.web';

import VolumeLowIcon from './';

describe('<VolumeLowIcon />', () => {
  it('should render VolumeLowIcon', () => {
    const { container } = renderWithTheme(
      <VolumeLowIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
