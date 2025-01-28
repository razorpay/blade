import ArrowSquareDownIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowSquareDownIcon />', () => {
  it('should render ArrowSquareDownIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowSquareDownIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
