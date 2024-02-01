import BoldIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BoldIcon />', () => {
  it('should render BoldIcon', () => {
    const { container } = renderWithTheme(
      <BoldIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
