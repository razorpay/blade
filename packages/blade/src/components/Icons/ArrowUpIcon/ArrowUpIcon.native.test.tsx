import ArrowUpIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowUpIcon />', () => {
  it('should render ArrowUpIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
