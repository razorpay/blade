import ScanIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ScanIcon />', () => {
  it('should render ScanIcon', () => {
    const { container } = renderWithTheme(
      <ScanIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
