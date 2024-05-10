import AffordabilityIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AffordabilityIcon />', () => {
  it('should render AffordabilityIcon', () => {
    const renderTree = renderWithTheme(
      <AffordabilityIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
