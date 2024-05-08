import RotateCwIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RotateCwIcon />', () => {
  it('should render RotateCwIcon', () => {
    const { container } = renderWithTheme(
      <RotateCwIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
