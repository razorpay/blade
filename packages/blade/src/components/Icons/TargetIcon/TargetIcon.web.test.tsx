import TargetIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<TargetIcon />', () => {
  it('should render TargetIcon', () => {
    const { container } = renderWithTheme(
      <TargetIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
