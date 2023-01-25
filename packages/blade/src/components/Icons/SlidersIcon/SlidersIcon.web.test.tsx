import SlidersIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SlidersIcon />', () => {
  it('should render SlidersIcon', () => {
    const { container } = renderWithTheme(
      <SlidersIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
