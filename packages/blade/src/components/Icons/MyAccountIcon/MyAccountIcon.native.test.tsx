import MyAccountIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MyAccountIcon />', () => {
  it('should render MyAccountIcon', () => {
    const renderTree = renderWithTheme(
      <MyAccountIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
