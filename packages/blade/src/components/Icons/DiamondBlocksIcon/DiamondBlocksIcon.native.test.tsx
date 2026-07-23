import DiamondBlocksIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DiamondBlocksIcon />', () => {
  it('should render DiamondBlocksIcon', () => {
    const renderTree = renderWithTheme(
      <DiamondBlocksIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
