import CutIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CutIcon />', () => {
  it('should render CutIcon', () => {
    const { container } = renderWithTheme(
      <CutIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
