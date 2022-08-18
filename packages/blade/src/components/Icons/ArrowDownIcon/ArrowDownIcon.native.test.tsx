import ArrowDownIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ArrowDownIcon />', () => {
  it('should render ArrowDownIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
