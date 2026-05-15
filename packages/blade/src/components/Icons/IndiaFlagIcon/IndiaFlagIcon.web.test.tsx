import renderWithTheme from '~utils/testing/renderWithTheme.web';

import IndiaFlagIcon from './';

describe('<IndiaFlagIcon />', () => {
  it('should render IndiaFlagIcon', () => {
    const { container } = renderWithTheme(
      <IndiaFlagIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
