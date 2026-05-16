import renderWithTheme from '~utils/testing/renderWithTheme.native';

import AutomateAccountingIcon from '.';

describe('<AutomateAccountingIcon />', () => {
  it('should render AutomateAccountingIcon', () => {
    const renderTree = renderWithTheme(
      <AutomateAccountingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
