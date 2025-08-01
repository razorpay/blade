import InvoicesFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<InvoicesFilledIcon />', () => {
  it('should render InvoicesFilledIcon', () => {
    const renderTree = renderWithTheme(
      <InvoicesFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
