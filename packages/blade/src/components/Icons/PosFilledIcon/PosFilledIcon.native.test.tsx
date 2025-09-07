import PosFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PosFilledIcon />', () => {
  it('should render PosFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PosFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
