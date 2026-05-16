import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PayrollAddonsFilledIcon from '.';

describe('<PayrollAddonsFilledIcon />', () => {
  it('should render PayrollAddonsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PayrollAddonsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
