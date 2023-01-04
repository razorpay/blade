import Volume2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Volume2Icon />', () => {
  it('should render Volume2Icon', () => {
    const { container } = renderWithTheme(
      <Volume2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
