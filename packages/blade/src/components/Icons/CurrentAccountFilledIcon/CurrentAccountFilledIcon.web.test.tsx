import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CurrentAccountFilledIcon from './';

describe('<CurrentAccountFilledIcon />', () => {
  it('should render CurrentAccountFilledIcon', () => {
    const { container } = renderWithTheme(
      <CurrentAccountFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
