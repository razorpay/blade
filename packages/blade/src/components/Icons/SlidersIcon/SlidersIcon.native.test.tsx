import SlidersIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<SlidersIcon />', () => {
  it('should render SlidersIcon', () => {
    const renderTree = renderWithTheme(
      <SlidersIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
