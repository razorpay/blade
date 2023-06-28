import OctagonIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<OctagonIcon />', () => {
  it('should render OctagonIcon', () => {
    const { container } = renderWithTheme(
      <OctagonIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
