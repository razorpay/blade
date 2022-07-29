import InfoIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<InfoIcon />', () => {
  it('should render InfoIcon', () => {
    const renderTree = renderWithTheme(
      <InfoIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
