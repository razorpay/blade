import HelpCircleIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<HelpCircleIcon />', () => {
  it('should render HelpCircleIcon', () => {
    const renderTree = renderWithTheme(
      <HelpCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
