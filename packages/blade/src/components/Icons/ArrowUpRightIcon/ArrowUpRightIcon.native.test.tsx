import ArrowUpRightIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowUpRightIcon />', () => {
  it('should render ArrowUpRightIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowUpRightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
