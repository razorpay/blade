import BarChart2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BarChart2Icon />', () => {
  it('should render BarChart2Icon', () => {
    const renderTree = renderWithTheme(
      <BarChart2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
