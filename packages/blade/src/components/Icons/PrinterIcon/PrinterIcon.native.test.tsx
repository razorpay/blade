import PrinterIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<PrinterIcon />', () => {
  it('should render PrinterIcon', () => {
    const renderTree = renderWithTheme(
      <PrinterIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
