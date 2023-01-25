import CornerDownLeftIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CornerDownLeftIcon />', () => {
  it('should render CornerDownLeftIcon', () => {
    const { container } = renderWithTheme(
      <CornerDownLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
