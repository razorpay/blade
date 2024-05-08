import CashIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CashIcon />', () => {
  it('should render CashIcon', () => {
    const renderTree = renderWithTheme(
      <CashIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
