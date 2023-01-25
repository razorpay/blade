import InvoicesIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<InvoicesIcon />', () => {
  it('should render InvoicesIcon', () => {
    const renderTree = renderWithTheme(
      <InvoicesIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
