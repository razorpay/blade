import renderWithTheme from '~utils/testing/renderWithTheme.web';

import Battery60PercentIcon from './';

describe('<Battery60PercentIcon />', () => {
  it('should render Battery60PercentIcon', () => {
    const { container } = renderWithTheme(
      <Battery60PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
