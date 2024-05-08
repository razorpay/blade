import CornerLeftUpIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CornerLeftUpIcon />', () => {
  it('should render CornerLeftUpIcon', () => {
    const renderTree = renderWithTheme(
      <CornerLeftUpIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
