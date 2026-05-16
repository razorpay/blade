import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SunIcon from './';

describe('<SunIcon />', () => {
  it('should render SunIcon', () => {
    const { container } = renderWithTheme(
      <SunIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
