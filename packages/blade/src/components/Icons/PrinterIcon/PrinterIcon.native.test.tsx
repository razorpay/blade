import PrinterIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PrinterIcon />', () => {
  it('should render PrinterIcon', () => {
    const renderTree = renderWithTheme(
      <PrinterIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
