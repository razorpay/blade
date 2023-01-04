import Maximize2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Maximize2Icon />', () => {
  it('should render Maximize2Icon', () => {
    const { container } = renderWithTheme(
      <Maximize2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
