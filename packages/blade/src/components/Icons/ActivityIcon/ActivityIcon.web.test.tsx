import ActivityIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ActivityIcon />', () => {
  it('should render ActivityIcon', () => {
    const { container } = renderWithTheme(
      <ActivityIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
