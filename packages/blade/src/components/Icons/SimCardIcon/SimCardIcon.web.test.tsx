import SimCardIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SimCardIcon />', () => {
  it('should render SimCardIcon', () => {
    const { container } = renderWithTheme(
      <SimCardIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
