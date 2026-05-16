import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ServerIcon from './';

describe('<ServerIcon />', () => {
  it('should render ServerIcon', () => {
    const { container } = renderWithTheme(
      <ServerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
