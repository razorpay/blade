import renderWithTheme from '~utils/testing/renderWithTheme.web';

import UserCheckIcon from './';

describe('<UserCheckIcon />', () => {
  it('should render UserCheckIcon', () => {
    const { container } = renderWithTheme(
      <UserCheckIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
