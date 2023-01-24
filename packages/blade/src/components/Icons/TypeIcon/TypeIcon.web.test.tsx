import TypeIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<TypeIcon />', () => {
  it('should render TypeIcon', () => {
    const { container } = renderWithTheme(
      <TypeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
