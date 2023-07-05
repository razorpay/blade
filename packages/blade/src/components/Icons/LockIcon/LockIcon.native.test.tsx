import LockIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<LockIcon />', () => {
  it('should render LockIcon', () => {
    const renderTree = renderWithTheme(
      <LockIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
