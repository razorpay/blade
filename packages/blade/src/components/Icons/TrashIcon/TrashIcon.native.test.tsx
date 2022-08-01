import TrashIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<TrashIcon />', () => {
  it('should render TrashIcon', () => {
    const renderTree = renderWithTheme(
      <TrashIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
