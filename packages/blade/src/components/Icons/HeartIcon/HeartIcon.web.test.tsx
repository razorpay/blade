import HeartIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<HeartIcon />', () => {
  it('should render HeartIcon', () => {
    const { container } = renderWithTheme(
      <HeartIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
