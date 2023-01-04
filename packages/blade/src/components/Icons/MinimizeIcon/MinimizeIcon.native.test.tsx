import MinimizeIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MinimizeIcon />', () => {
  it('should render MinimizeIcon', () => {
    const renderTree = renderWithTheme(
      <MinimizeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
