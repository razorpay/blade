import ArrowUpIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ArrowUpIcon />', () => {
  it('should render ArrowUpIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
