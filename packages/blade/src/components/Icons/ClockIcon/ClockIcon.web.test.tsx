import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ClockIcon from './';

describe('<ClockIcon />', () => {
  it('should render ClockIcon', () => {
    const { container } = renderWithTheme(
      <ClockIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
