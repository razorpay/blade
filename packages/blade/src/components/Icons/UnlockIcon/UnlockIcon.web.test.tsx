import UnlockIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<UnlockIcon />', () => {
  it('should render UnlockIcon', () => {
    const { container } = renderWithTheme(
      <UnlockIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
