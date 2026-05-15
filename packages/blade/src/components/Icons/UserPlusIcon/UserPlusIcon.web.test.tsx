import renderWithTheme from '~utils/testing/renderWithTheme.web';

import UserPlusIcon from './';

describe('<UserPlusIcon />', () => {
  it('should render UserPlusIcon', () => {
    const { container } = renderWithTheme(
      <UserPlusIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
