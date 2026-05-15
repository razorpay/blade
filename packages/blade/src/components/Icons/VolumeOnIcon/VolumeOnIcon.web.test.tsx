import renderWithTheme from '~utils/testing/renderWithTheme.web';

import VolumeOnIcon from './';

describe('<VolumeOnIcon />', () => {
  it('should render VolumeOnIcon', () => {
    const { container } = renderWithTheme(
      <VolumeOnIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
