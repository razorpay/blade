import ZapIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ZapIcon />', () => {
  it('should render ZapIcon', () => {
    const renderTree = renderWithTheme(
      <ZapIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
