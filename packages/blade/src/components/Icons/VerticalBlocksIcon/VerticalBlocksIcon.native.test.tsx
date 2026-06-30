import VerticalBlocksIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<VerticalBlocksIcon />', () => {
  it('should render VerticalBlocksIcon', () => {
    const renderTree = renderWithTheme(
      <VerticalBlocksIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
