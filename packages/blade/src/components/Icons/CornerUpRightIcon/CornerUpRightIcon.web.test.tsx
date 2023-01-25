import CornerUpRightIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CornerUpRightIcon />', () => {
  it('should render CornerUpRightIcon', () => {
    const { container } = renderWithTheme(
      <CornerUpRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
