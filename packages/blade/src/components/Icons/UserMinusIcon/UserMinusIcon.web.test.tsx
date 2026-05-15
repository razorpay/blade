import renderWithTheme from '~utils/testing/renderWithTheme.web';

import UserMinusIcon from './';

describe('<UserMinusIcon />', () => {
  it('should render UserMinusIcon', () => {
    const { container } = renderWithTheme(
      <UserMinusIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
