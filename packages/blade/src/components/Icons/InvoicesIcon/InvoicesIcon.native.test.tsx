import renderWithTheme from '~utils/testing/renderWithTheme.native';

import InvoicesIcon from '.';

describe('<InvoicesIcon />', () => {
  it('should render InvoicesIcon', () => {
    const renderTree = renderWithTheme(
      <InvoicesIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
