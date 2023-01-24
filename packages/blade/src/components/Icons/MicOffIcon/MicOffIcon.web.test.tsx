import MicOffIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MicOffIcon />', () => {
  it('should render MicOffIcon', () => {
    const { container } = renderWithTheme(
      <MicOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
