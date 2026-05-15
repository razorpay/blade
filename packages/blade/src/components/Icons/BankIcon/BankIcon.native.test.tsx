import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BankIcon from '.';

describe('<BankIcon />', () => {
  it('should render CloseIcon', () => {
    const renderTree = renderWithTheme(
      <BankIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
