import AffordabilityIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AffordabilityIcon />', () => {
  it('should render AffordabilityIcon', () => {
    const { container } = renderWithTheme(
      <AffordabilityIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
