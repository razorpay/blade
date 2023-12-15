import CutIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CutIcon />', () => {
  it('should render CutIcon', () => {
    const { container } = renderWithTheme(
      <CutIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
