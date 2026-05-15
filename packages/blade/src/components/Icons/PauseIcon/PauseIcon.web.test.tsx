import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PauseIcon from './';

describe('<PauseIcon />', () => {
  it('should render PauseIcon', () => {
    const { container } = renderWithTheme(
      <PauseIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
