import WindIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<WindIcon />', () => {
  it('should render WindIcon', () => {
    const { container } = renderWithTheme(
      <WindIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
