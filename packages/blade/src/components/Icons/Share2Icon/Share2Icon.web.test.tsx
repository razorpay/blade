import Share2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Share2Icon />', () => {
  it('should render Share2Icon', () => {
    const { container } = renderWithTheme(
      <Share2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
