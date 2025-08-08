import EscrowAccountFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EscrowAccountFilledIcon />', () => {
  it('should render EscrowAccountFilledIcon', () => {
    const renderTree = renderWithTheme(
      <EscrowAccountFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
