import VerticalBlocksIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<VerticalBlocksIcon />', () => {
  it('should render VerticalBlocksIcon', () => {
    const { container } = renderWithTheme(
      <VerticalBlocksIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
