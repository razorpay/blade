import CrosshairIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CrosshairIcon />', () => {
  it('should render CrosshairIcon', () => {
    const renderTree = renderWithTheme(
      <CrosshairIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
