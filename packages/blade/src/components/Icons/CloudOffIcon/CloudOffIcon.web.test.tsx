import CloudOffIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CloudOffIcon />', () => {
  it('should render CloudOffIcon', () => {
    const { container } = renderWithTheme(
      <CloudOffIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
