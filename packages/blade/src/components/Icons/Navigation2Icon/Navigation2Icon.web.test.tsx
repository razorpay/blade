import Navigation2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Navigation2Icon />', () => {
  it('should render Navigation2Icon', () => {
    const { container } = renderWithTheme(
      <Navigation2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
