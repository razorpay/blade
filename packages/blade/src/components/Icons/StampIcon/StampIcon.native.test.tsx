import StampIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<StampIcon />', () => {
  it('should render StampIcon', () => {
    const renderTree = renderWithTheme(
      <StampIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
