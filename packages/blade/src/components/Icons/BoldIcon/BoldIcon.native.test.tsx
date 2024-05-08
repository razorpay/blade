import BoldIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BoldIcon />', () => {
  it('should render BoldIcon', () => {
    const renderTree = renderWithTheme(
      <BoldIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
