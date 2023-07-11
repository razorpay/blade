import PowerIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PowerIcon />', () => {
  it('should render PowerIcon', () => {
    const renderTree = renderWithTheme(
      <PowerIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
