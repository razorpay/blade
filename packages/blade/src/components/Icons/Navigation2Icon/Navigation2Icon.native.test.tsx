import Navigation2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Navigation2Icon />', () => {
  it('should render Navigation2Icon', () => {
    const renderTree = renderWithTheme(
      <Navigation2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
