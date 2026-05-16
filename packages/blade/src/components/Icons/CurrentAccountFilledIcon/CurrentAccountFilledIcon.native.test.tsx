import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CurrentAccountFilledIcon from '.';

describe('<CurrentAccountFilledIcon />', () => {
  it('should render CurrentAccountFilledIcon', () => {
    const renderTree = renderWithTheme(
      <CurrentAccountFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
