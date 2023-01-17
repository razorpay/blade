import ServerIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ServerIcon />', () => {
  it('should render ServerIcon', () => {
    const renderTree = renderWithTheme(
      <ServerIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
