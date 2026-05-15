import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SunriseIcon from './';

describe('<SunriseIcon />', () => {
  it('should render SunriseIcon', () => {
    const { container } = renderWithTheme(
      <SunriseIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
