import renderWithTheme from '~utils/testing/renderWithTheme.web';

import LogInIcon from './';

describe('<LogInIcon />', () => {
  it('should render LogInIcon', () => {
    const { container } = renderWithTheme(
      <LogInIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
