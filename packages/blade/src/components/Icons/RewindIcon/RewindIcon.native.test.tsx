import RewindIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RewindIcon />', () => {
  it('should render RewindIcon', () => {
    const renderTree = renderWithTheme(
      <RewindIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
