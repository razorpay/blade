import CornerRightDownIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CornerRightDownIcon />', () => {
  it('should render CornerRightDownIcon', () => {
    const { container } = renderWithTheme(
      <CornerRightDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
