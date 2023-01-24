import UserMinusIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<UserMinusIcon />', () => {
  it('should render UserMinusIcon', () => {
    const renderTree = renderWithTheme(
      <UserMinusIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
