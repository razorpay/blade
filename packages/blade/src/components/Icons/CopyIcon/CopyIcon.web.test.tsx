import CopyIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CopyIcon />', () => {
  it('should render CopyIcon', () => {
    const { container } = renderWithTheme(
      <CopyIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
