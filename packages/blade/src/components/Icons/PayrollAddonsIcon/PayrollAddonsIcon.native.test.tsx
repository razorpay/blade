import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PayrollAddonsIcon from '.';

describe('<PayrollAddonsIcon />', () => {
  it('should render PayrollAddonsIcon', () => {
    const renderTree = renderWithTheme(
      <PayrollAddonsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
