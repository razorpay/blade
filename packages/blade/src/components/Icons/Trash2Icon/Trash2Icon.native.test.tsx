import Trash2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Trash2Icon />', () => {
  it('should render Trash2Icon', () => {
    const renderTree = renderWithTheme(
      <Trash2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
