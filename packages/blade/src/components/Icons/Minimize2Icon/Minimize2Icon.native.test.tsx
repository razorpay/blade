import Minimize2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Minimize2Icon />', () => {
  it('should render Minimize2Icon', () => {
    const renderTree = renderWithTheme(
      <Minimize2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
