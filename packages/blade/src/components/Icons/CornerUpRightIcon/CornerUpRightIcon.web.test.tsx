import CornerUpRightIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CornerUpRightIcon />', () => {
  it('should render CornerUpRightIcon', () => {
    const { container } = renderWithTheme(
      <CornerUpRightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
