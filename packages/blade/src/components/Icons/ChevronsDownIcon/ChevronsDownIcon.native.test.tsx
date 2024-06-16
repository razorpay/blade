import ChevronsDownIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ChevronsDownIcon />', () => {
  it('should render ChevronsDownIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronsDownIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
