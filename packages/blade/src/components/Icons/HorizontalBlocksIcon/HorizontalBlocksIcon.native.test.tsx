import HorizontalBlocksIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<HorizontalBlocksIcon />', () => {
  it('should render HorizontalBlocksIcon', () => {
    const renderTree = renderWithTheme(
      <HorizontalBlocksIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
