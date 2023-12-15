import SlidersIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SlidersIcon />', () => {
  it('should render SlidersIcon', () => {
    const { container } = renderWithTheme(
      <SlidersIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
