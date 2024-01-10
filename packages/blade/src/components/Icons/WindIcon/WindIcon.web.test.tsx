import WindIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<WindIcon />', () => {
  it('should render WindIcon', () => {
    const { container } = renderWithTheme(
      <WindIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
