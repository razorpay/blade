import AffordabilityFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AffordabilityFilledIcon />', () => {
  it('should render AffordabilityFilledIcon', () => {
    const renderTree = renderWithTheme(
      <AffordabilityFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
