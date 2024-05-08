import MoreHorizontalIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MoreHorizontalIcon />', () => {
  it('should render MoreHorizontalIcon', () => {
    const { container } = renderWithTheme(
      <MoreHorizontalIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
