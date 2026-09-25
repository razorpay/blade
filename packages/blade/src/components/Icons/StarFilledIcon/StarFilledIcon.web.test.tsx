import StarFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<StarFilledIcon />', () => {
  it('should render StarFilledIcon', () => {
    const { container } = renderWithTheme(
      <StarFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
