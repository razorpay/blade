import Link2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Link2Icon />', () => {
  it('should render Link2Icon', () => {
    const { container } = renderWithTheme(
      <Link2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
