import LockIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<LockIcon />', () => {
  it('should render LockIcon', () => {
    const renderTree = renderWithTheme(
      <LockIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
