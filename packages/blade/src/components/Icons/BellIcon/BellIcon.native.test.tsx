import BellIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BellIcon />', () => {
  it('should render BellIcon', () => {
    const renderTree = renderWithTheme(
      <BellIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
