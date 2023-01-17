import ShieldIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ShieldIcon />', () => {
  it('should render ShieldIcon', () => {
    const renderTree = renderWithTheme(
      <ShieldIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
