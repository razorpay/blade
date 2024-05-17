import InvoicesIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<InvoicesIcon />', () => {
  it('should render InvoicesIcon', () => {
    const renderTree = renderWithTheme(
      <InvoicesIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
