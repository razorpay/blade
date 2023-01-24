import CastIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CastIcon />', () => {
  it('should render CastIcon', () => {
    const { container } = renderWithTheme(
      <CastIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
