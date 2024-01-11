import PrinterIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PrinterIcon />', () => {
  it('should render PrinterIcon', () => {
    const { container } = renderWithTheme(
      <PrinterIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
