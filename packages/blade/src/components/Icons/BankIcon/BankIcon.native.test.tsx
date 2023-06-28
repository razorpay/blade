import BankIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BankIcon />', () => {
  it('should render CloseIcon', () => {
    const renderTree = renderWithTheme(
      <BankIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
