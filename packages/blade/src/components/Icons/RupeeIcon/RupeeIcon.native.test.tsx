import RupeeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RupeeIcon />', () => {
  it('should render RupeeIcon', () => {
    const renderTree = renderWithTheme(
      <RupeeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
