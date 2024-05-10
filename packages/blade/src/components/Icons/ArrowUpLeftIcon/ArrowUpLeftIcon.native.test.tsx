import ArrowUpLeftIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowUpLeftIcon />', () => {
  it('should render ArrowUpLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowUpLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
