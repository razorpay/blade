import Link2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Link2Icon />', () => {
  it('should render Link2Icon', () => {
    const renderTree = renderWithTheme(
      <Link2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
