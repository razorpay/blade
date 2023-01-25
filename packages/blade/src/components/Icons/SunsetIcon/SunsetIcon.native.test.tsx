import SunsetIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<SunsetIcon />', () => {
  it('should render SunsetIcon', () => {
    const renderTree = renderWithTheme(
      <SunsetIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
