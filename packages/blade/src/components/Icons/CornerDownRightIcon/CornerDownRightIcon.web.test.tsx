import CornerDownRightIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CornerDownRightIcon />', () => {
  it('should render CornerDownRightIcon', () => {
    const { container } = renderWithTheme(
      <CornerDownRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
