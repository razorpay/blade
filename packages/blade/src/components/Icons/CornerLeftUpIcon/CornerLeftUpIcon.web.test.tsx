import CornerLeftUpIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CornerLeftUpIcon />', () => {
  it('should render CornerLeftUpIcon', () => {
    const { container } = renderWithTheme(
      <CornerLeftUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
