import CornerRightUpIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CornerRightUpIcon />', () => {
  it('should render CornerRightUpIcon', () => {
    const renderTree = renderWithTheme(
      <CornerRightUpIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
