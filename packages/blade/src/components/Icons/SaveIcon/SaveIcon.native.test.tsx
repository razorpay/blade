import SaveIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SaveIcon />', () => {
  it('should render SaveIcon', () => {
    const renderTree = renderWithTheme(
      <SaveIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
