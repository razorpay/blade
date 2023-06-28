import FeatherIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FeatherIcon />', () => {
  it('should render FeatherIcon', () => {
    const { container } = renderWithTheme(
      <FeatherIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
