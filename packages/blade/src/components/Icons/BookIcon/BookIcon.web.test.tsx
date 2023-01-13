<<<<<<< HEAD
import BookIcon from './';
=======
import BookIcon from '.';
>>>>>>> 040d97b443eefc890f09135209435b247e119b98
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BookIcon />', () => {
  it('should render BookIcon', () => {
    const { container } = renderWithTheme(
      <BookIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
