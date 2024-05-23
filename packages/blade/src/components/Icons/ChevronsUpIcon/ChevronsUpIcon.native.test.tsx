import ChevronsUpIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ChevronsUpIcon />', () => {
  it('should render ChevronsUpIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronsUpIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
