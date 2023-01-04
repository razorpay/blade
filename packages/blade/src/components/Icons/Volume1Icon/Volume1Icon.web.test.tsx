import Volume1Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Volume1Icon />', () => {
  it('should render Volume1Icon', () => {
    const { container } = renderWithTheme(
      <Volume1Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
