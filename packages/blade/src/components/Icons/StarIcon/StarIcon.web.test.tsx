import StarIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<StarIcon />', () => {
  it('should render StarIcon', () => {
    const { container } = renderWithTheme(
      <StarIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
