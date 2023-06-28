import CircleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CircleIcon />', () => {
  it('should render CircleIcon', () => {
    const { container } = renderWithTheme(
      <CircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
