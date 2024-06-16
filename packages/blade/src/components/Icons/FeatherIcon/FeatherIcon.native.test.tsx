import FeatherIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FeatherIcon />', () => {
  it('should render FeatherIcon', () => {
    const renderTree = renderWithTheme(
      <FeatherIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
