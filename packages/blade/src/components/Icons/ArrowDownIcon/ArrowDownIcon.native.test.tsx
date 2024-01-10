import ArrowDownIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowDownIcon />', () => {
  it('should render ArrowDownIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowDownIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
