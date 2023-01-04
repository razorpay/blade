import AlertOnlyIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<AlertOnlyIcon />', () => {
  it('should render AlertOnlyIcon', () => {
    const renderTree = renderWithTheme(
      <AlertOnlyIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
