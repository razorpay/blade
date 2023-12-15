import TypeIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TypeIcon />', () => {
  it('should render TypeIcon', () => {
    const renderTree = renderWithTheme(
      <TypeIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
