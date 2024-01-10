import CornerRightDownIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CornerRightDownIcon />', () => {
  it('should render CornerRightDownIcon', () => {
    const { container } = renderWithTheme(
      <CornerRightDownIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
