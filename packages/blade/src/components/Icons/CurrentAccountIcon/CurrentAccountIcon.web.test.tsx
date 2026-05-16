import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CurrentAccountIcon from './';

describe('<CurrentAccountIcon />', () => {
  it('should render CurrentAccountIcon', () => {
    const { container } = renderWithTheme(
      <CurrentAccountIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
