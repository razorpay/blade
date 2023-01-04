import BarChart2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BarChart2Icon />', () => {
  it('should render BarChart2Icon', () => {
    const { container } = renderWithTheme(
      <BarChart2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
