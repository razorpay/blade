import CopyIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CopyIcon />', () => {
  it('should render CopyIcon', () => {
    const renderTree = renderWithTheme(
      <CopyIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
