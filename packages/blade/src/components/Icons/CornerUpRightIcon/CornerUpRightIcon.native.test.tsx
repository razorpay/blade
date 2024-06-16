import CornerUpRightIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CornerUpRightIcon />', () => {
  it('should render CornerUpRightIcon', () => {
    const renderTree = renderWithTheme(
      <CornerUpRightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
