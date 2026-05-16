import renderWithTheme from '~utils/testing/renderWithTheme.web';

import Battery20PercentIcon from './';

describe('<Battery20PercentIcon />', () => {
  it('should render Battery20PercentIcon', () => {
    const { container } = renderWithTheme(
      <Battery20PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
