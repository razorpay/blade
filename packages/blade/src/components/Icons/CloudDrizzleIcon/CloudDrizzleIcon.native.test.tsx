import CloudDrizzleIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CloudDrizzleIcon />', () => {
  it('should render CloudDrizzleIcon', () => {
    const renderTree = renderWithTheme(
      <CloudDrizzleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
