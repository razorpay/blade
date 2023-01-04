import Share2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Share2Icon />', () => {
  it('should render Share2Icon', () => {
    const renderTree = renderWithTheme(
      <Share2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
