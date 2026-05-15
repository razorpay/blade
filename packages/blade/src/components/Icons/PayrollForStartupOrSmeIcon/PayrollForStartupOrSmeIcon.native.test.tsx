import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PayrollForStartupOrSmeIcon from '.';

describe('<PayrollForStartupOrSmeIcon />', () => {
  it('should render PayrollForStartupOrSmeIcon', () => {
    const renderTree = renderWithTheme(
      <PayrollForStartupOrSmeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
