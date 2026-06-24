import DiamondBlocksIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DiamondBlocksIcon />', () => {
  it('should render DiamondBlocksIcon', () => {
    const { container } = renderWithTheme(
      <DiamondBlocksIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
