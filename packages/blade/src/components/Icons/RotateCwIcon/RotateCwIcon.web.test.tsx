import RotateCwIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RotateCwIcon />', () => {
  it('should render RotateCwIcon', () => {
    const { container } = renderWithTheme(
      <RotateCwIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
