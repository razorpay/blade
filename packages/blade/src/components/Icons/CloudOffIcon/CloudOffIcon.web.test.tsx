import CloudOffIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CloudOffIcon />', () => {
  it('should render CloudOffIcon', () => {
    const { container } = renderWithTheme(
      <CloudOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
