import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PayrollForCaFilledIcon from '.';

describe('<PayrollForCaFilledIcon />', () => {
  it('should render PayrollForCaFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PayrollForCaFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
