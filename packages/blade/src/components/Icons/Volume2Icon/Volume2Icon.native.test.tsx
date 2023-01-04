import Volume2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Volume2Icon />', () => {
  it('should render Volume2Icon', () => {
    const renderTree = renderWithTheme(
      <Volume2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
