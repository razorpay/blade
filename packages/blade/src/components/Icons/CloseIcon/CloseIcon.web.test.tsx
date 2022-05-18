import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import CloseIcon from '.';

describe('<CloseIcon />', () => {
  it('should render CloseIcon', () => {
    const { container } = renderWithTheme(
      <CloseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
