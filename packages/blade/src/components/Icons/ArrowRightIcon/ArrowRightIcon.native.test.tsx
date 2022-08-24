import ArrowRightIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ArrowRightIcon />', () => {
  it('should render ArrowRightIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
