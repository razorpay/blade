import ArrowLeftIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowLeftIcon />', () => {
  it('should render ArrowLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
