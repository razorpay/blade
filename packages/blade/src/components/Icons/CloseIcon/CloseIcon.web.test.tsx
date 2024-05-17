import CloseIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CloseIcon />', () => {
  it('should render CloseIcon', () => {
    const { container } = renderWithTheme(
      <CloseIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
