import InfoIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<InfoIcon />', () => {
  it('should render InfoIcon', () => {
    const renderTree = renderWithTheme(
      <InfoIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
