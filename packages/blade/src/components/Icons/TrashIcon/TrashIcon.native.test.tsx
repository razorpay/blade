import TrashIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TrashIcon />', () => {
  it('should render TrashIcon', () => {
    const renderTree = renderWithTheme(
      <TrashIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
