import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SkipForwardIcon from './';

describe('<SkipForwardIcon />', () => {
  it('should render SkipForwardIcon', () => {
    const { container } = renderWithTheme(
      <SkipForwardIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
