import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SimCardIcon from './';

describe('<SimCardIcon />', () => {
  it('should render SimCardIcon', () => {
    const { container } = renderWithTheme(
      <SimCardIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
