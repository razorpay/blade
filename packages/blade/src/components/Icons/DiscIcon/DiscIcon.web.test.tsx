import DiscIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DiscIcon />', () => {
  it('should render DiscIcon', () => {
    const { container } = renderWithTheme(
      <DiscIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
