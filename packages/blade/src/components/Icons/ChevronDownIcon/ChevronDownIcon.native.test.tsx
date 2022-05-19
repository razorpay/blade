import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import ChevronDownIcon from '.';

describe('<ChevronDownIcon />', () => {
  it('should render ChevronDownIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
