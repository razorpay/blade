import renderWithTheme from '~utils/testing/renderWithTheme.web';

import Signal4BarIcon from './';

describe('<Signal4BarIcon />', () => {
  it('should render Signal4BarIcon', () => {
    const { container } = renderWithTheme(
      <Signal4BarIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
