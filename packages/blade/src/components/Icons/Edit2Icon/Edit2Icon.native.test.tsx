import Edit2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Edit2Icon />', () => {
  it('should render Edit2Icon', () => {
    const renderTree = renderWithTheme(
      <Edit2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
