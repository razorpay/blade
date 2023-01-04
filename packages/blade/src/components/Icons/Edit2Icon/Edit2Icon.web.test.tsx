import Edit2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Edit2Icon />', () => {
  it('should render Edit2Icon', () => {
    const { container } = renderWithTheme(
      <Edit2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
