import SunIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<SunIcon />', () => {
  it('should render SunIcon', () => {
    const renderTree = renderWithTheme(
      <SunIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
