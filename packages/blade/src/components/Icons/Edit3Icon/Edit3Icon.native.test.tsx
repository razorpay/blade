import Edit3Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Edit3Icon />', () => {
  it('should render Edit3Icon', () => {
    const renderTree = renderWithTheme(
      <Edit3Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
