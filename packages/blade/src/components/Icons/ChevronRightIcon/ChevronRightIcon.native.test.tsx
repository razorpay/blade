import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import ChevronRightIcon from '.';

describe('<ChevronRightIcon />', () => {
  it('should render ChevronRightIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
