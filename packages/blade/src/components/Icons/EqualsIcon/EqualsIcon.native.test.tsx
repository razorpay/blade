import EqualsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EqualsIcon />', () => {
  it('should render EqualsIcon', () => {
    const renderTree = renderWithTheme(
      <EqualsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
