import Edit3Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Edit3Icon />', () => {
  it('should render Edit3Icon', () => {
    const { container } = renderWithTheme(
      <Edit3Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
