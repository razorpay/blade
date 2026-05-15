import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PayrollForStartupOrSmeFilledIcon from '.';

describe('<PayrollForStartupOrSmeFilledIcon />', () => {
  it('should render PayrollForStartupOrSmeFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PayrollForStartupOrSmeFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
