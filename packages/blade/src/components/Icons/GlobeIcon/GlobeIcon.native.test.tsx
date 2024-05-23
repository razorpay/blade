import GlobeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<GlobeIcon />', () => {
  it('should render GlobeIcon', () => {
    const renderTree = renderWithTheme(
      <GlobeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
