import renderWithTheme from '~utils/testing/renderWithTheme.web';

import Battery80PercentIcon from './';

describe('<Battery80PercentIcon />', () => {
  it('should render Battery80PercentIcon', () => {
    const { container } = renderWithTheme(
      <Battery80PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
