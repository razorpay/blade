import AutomateAccountingIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AutomateAccountingIcon />', () => {
  it('should render AutomateAccountingIcon', () => {
    const renderTree = renderWithTheme(
      <AutomateAccountingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
