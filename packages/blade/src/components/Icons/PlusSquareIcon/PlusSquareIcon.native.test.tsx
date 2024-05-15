import PlusSquareIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PlusSquareIcon />', () => {
  it('should render PlusSquareIcon', () => {
    const renderTree = renderWithTheme(
      <PlusSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
