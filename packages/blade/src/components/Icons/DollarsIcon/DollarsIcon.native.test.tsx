import DollarsIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<DollarsIcon />', () => {
  it('should render DollarsIcon', () => {
    const renderTree = renderWithTheme(
      <DollarsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
