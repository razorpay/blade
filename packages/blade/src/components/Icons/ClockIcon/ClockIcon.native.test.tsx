import ClockIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ClockIcon />', () => {
  it('should render ChevronUpIcon', () => {
    const renderTree = renderWithTheme(
      <ClockIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
