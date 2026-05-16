import renderWithTheme from '~utils/testing/renderWithTheme.web';

import LogOutIcon from './';

describe('<LogOutIcon />', () => {
  it('should render LogOutIcon', () => {
    const { container } = renderWithTheme(
      <LogOutIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
