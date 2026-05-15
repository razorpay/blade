import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SunsetIcon from './';

describe('<SunsetIcon />', () => {
  it('should render SunsetIcon', () => {
    const { container } = renderWithTheme(
      <SunsetIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
