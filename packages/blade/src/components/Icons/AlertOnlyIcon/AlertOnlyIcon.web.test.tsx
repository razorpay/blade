import AlertOnlyIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AlertOnlyIcon />', () => {
  it('should render AlertOnlyIcon', () => {
    const { container } = renderWithTheme(
      <AlertOnlyIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
