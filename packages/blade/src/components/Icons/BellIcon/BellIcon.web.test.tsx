import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BellIcon from './';

describe('<BellIcon />', () => {
  it('should render BellIcon', () => {
    const { container } = renderWithTheme(
      <BellIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
