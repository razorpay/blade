import BfsiIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BfsiIcon />', () => {
  it('should render BfsiIcon', () => {
    const renderTree = renderWithTheme(
      <BfsiIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
