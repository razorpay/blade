import DiscIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<DiscIcon />', () => {
  it('should render DiscIcon', () => {
    const { container } = renderWithTheme(
      <DiscIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
