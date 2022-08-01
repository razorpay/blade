import PlusIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<PlusIcon />', () => {
  it('should render PlusIcon', () => {
    const renderTree = renderWithTheme(
      <PlusIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
