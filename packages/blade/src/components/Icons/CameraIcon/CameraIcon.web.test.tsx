import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CameraIcon from './';

describe('<CameraIcon />', () => {
  it('should render CameraIcon', () => {
    const { container } = renderWithTheme(
      <CameraIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
