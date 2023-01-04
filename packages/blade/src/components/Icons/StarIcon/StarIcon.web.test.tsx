import StarIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<StarIcon />', () => {
  it('should render StarIcon', () => {
    const { container } = renderWithTheme(
      <StarIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
