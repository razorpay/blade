import CornerRightUpIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CornerRightUpIcon />', () => {
  it('should render CornerRightUpIcon', () => {
    const { container } = renderWithTheme(
      <CornerRightUpIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
