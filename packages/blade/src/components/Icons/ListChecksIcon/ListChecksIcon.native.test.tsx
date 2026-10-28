import ListChecksIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ListChecksIcon />', () => {
  it('should render ListChecksIcon', () => {
    const renderTree = renderWithTheme(
      <ListChecksIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
