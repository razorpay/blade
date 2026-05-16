import renderWithTheme from '~utils/testing/renderWithTheme.web';

import VideoIcon from './';

describe('<VideoIcon />', () => {
  it('should render VideoIcon', () => {
    const { container } = renderWithTheme(
      <VideoIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
