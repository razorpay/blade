import TargetIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TargetIcon />', () => {
  it('should render TargetIcon', () => {
    const { container } = renderWithTheme(
      <TargetIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
