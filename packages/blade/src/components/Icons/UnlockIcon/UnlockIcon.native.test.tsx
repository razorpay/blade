import UnlockIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<UnlockIcon />', () => {
  it('should render UnlockIcon', () => {
    const renderTree = renderWithTheme(
      <UnlockIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
