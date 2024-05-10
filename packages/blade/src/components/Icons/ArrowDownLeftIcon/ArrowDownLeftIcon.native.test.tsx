import ArrowDownLeftIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowDownLeftIcon />', () => {
  it('should render ArrowDownLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowDownLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
