import renderWithTheme from '~utils/testing/renderWithTheme.web';

import UserIcon from './';

describe('<UserIcon />', () => {
  it('should render UserIcon', () => {
    const { container } = renderWithTheme(
      <UserIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
