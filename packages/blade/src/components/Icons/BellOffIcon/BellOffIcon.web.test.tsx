import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BellOffIcon from './';

describe('<BellOffIcon />', () => {
  it('should render BellOffIcon', () => {
    const { container } = renderWithTheme(
      <BellOffIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
