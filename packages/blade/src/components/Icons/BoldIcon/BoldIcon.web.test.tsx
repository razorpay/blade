import BoldIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BoldIcon />', () => {
  it('should render BoldIcon', () => {
    const { container } = renderWithTheme(
      <BoldIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
