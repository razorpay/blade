import Minimize2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Minimize2Icon />', () => {
  it('should render Minimize2Icon', () => {
    const { container } = renderWithTheme(
      <Minimize2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
