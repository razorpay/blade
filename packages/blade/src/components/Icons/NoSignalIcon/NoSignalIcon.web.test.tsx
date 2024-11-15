import NoSignalIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<NoSignalIcon />', () => {
  it('should render NoSignalIcon', () => {
    const { container } = renderWithTheme(
      <NoSignalIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
