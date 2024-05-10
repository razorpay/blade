import MoreIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MoreIcon />', () => {
  it('should render MoreIcon', () => {
    const { container } = renderWithTheme(
      <MoreIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
