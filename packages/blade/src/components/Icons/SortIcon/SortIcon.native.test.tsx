import SortIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SortIcon />', () => {
  it('should render SortIcon', () => {
    const renderTree = renderWithTheme(
      <SortIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
