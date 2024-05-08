import RotateCwIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RotateCwIcon />', () => {
  it('should render RotateCwIcon', () => {
    const renderTree = renderWithTheme(
      <RotateCwIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
