import FullScreenEnterIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FullScreenEnterIcon />', () => {
  it('should render FullScreenEnterIcon', () => {
    const renderTree = renderWithTheme(
      <FullScreenEnterIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
