import MoreVerticalIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MoreVerticalIcon />', () => {
  it('should render MoreVerticalIcon', () => {
    const renderTree = renderWithTheme(
      <MoreVerticalIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
