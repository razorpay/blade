import CornerUpLeftIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CornerUpLeftIcon />', () => {
  it('should render CornerUpLeftIcon', () => {
    const { container } = renderWithTheme(
      <CornerUpLeftIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
