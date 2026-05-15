import renderWithTheme from '~utils/testing/renderWithTheme.web';

import VolumeOffIcon from './';

describe('<VolumeOffIcon />', () => {
  it('should render VolumeOffIcon', () => {
    const { container } = renderWithTheme(
      <VolumeOffIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
