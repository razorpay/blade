import CornerDownLeftIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CornerDownLeftIcon />', () => {
  it('should render CornerDownLeftIcon', () => {
    const { container } = renderWithTheme(
      <CornerDownLeftIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
