import HashIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<HashIcon />', () => {
  it('should render HashIcon', () => {
    const { container } = renderWithTheme(
      <HashIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
