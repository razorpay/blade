import ArrowUpRightIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ArrowUpRightIcon />', () => {
  it('should render ArrowUpRightIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowUpRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
