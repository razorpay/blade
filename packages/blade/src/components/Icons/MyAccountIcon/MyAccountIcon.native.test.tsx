import MyAccountIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MyAccountIcon />', () => {
  it('should render MyAccountIcon', () => {
    const renderTree = renderWithTheme(
      <MyAccountIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
