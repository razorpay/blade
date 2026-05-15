import renderWithTheme from '~utils/testing/renderWithTheme.native';

import EscrowAccountIcon from '.';

describe('<EscrowAccountIcon />', () => {
  it('should render EscrowAccountIcon', () => {
    const renderTree = renderWithTheme(
      <EscrowAccountIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
