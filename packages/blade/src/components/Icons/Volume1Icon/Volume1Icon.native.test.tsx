import Volume1Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Volume1Icon />', () => {
  it('should render Volume1Icon', () => {
    const renderTree = renderWithTheme(
      <Volume1Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
