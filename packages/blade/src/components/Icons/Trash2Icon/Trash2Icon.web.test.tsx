import Trash2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Trash2Icon />', () => {
  it('should render Trash2Icon', () => {
    const { container } = renderWithTheme(
      <Trash2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
