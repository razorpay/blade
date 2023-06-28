import PocketIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PocketIcon />', () => {
  it('should render PocketIcon', () => {
    const renderTree = renderWithTheme(
      <PocketIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
