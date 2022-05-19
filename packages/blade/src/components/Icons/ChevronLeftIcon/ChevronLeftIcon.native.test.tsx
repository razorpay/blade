import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import ChevronLeftIcon from '.';

describe('<ChevronLeftIcon />', () => {
  it('should render ChevronLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
