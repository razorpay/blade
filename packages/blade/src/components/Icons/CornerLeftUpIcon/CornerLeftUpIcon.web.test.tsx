import CornerLeftUpIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CornerLeftUpIcon />', () => {
  it('should render CornerLeftUpIcon', () => {
    const { container } = renderWithTheme(
      <CornerLeftUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
