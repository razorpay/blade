import renderWithTheme from '~utils/testing/renderWithTheme.web';

import UserXIcon from './';

describe('<UserXIcon />', () => {
  it('should render UserXIcon', () => {
    const { container } = renderWithTheme(
      <UserXIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
