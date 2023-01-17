import ScanIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ScanIcon />', () => {
  it('should render ScanIcon', () => {
    const renderTree = renderWithTheme(
      <ScanIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
