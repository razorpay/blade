import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import ChevronUpIcon from '.';

describe('<ChevronUpIcon />', () => {
  it('should render ChevronUpIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
