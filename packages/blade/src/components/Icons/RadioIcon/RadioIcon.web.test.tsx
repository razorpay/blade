import RadioIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RadioIcon />', () => {
  it('should render RadioIcon', () => {
    const { container } = renderWithTheme(
      <RadioIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
