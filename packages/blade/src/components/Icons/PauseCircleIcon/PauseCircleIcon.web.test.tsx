import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PauseCircleIcon from './';

describe('<PauseCircleIcon />', () => {
  it('should render PauseCircleIcon', () => {
    const { container } = renderWithTheme(
      <PauseCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
