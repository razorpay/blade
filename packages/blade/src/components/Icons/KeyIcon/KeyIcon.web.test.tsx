import KeyIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KeyIcon />', () => {
  it('should render KeyIcon', () => {
    const { container } = renderWithTheme(
      <KeyIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
