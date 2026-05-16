import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CameraOffIcon from './';

describe('<CameraOffIcon />', () => {
  it('should render CameraOffIcon', () => {
    const { container } = renderWithTheme(
      <CameraOffIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
