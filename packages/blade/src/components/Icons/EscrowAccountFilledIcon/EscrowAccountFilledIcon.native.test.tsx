import renderWithTheme from '~utils/testing/renderWithTheme.native';

import EscrowAccountFilledIcon from '.';

describe('<EscrowAccountFilledIcon />', () => {
  it('should render EscrowAccountFilledIcon', () => {
    const renderTree = renderWithTheme(
      <EscrowAccountFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
