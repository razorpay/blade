import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import TrashIcon from '.';

describe('<TrashIcon />', () => {
  it('should render TrashIcon', () => {
    const renderTree = renderWithTheme(
      <TrashIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
