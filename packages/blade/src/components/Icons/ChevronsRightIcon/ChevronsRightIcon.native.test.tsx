import ChevronsRightIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ChevronsRightIcon />', () => {
  it('should render ChevronsRightIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronsRightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
