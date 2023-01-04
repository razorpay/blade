import ScissorsIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ScissorsIcon />', () => {
  it('should render ScissorsIcon', () => {
    const renderTree = renderWithTheme(
      <ScissorsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
