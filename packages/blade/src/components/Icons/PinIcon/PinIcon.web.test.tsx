import PinIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PinIcon />', () => {
  it('should render PinIcon', () => {
    const { container } = renderWithTheme(
      <PinIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
