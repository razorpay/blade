import ZapIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ZapIcon />', () => {
  it('should render ZapIcon', () => {
    const renderTree = renderWithTheme(
      <ZapIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
