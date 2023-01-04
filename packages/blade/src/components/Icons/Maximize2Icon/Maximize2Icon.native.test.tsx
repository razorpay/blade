import Maximize2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Maximize2Icon />', () => {
  it('should render Maximize2Icon', () => {
    const renderTree = renderWithTheme(
      <Maximize2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
