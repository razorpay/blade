import MoreHorizontalIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MoreHorizontalIcon />', () => {
  it('should render MoreHorizontalIcon', () => {
    const renderTree = renderWithTheme(
      <MoreHorizontalIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
