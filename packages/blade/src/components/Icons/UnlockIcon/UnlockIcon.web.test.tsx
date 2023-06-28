import UnlockIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UnlockIcon />', () => {
  it('should render UnlockIcon', () => {
    const { container } = renderWithTheme(
      <UnlockIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
