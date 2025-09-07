import AffordabilityFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AffordabilityFilledIcon />', () => {
  it('should render AffordabilityFilledIcon', () => {
    const { container } = renderWithTheme(
      <AffordabilityFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
