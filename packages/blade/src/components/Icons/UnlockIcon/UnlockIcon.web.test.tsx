import UnlockIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UnlockIcon />', () => {
  it('should render UnlockIcon', () => {
    const { container } = renderWithTheme(
      <UnlockIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
