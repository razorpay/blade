import RewindIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RewindIcon />', () => {
  it('should render RewindIcon', () => {
    const { container } = renderWithTheme(
      <RewindIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
