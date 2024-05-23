import HeadsetIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<HeadsetIcon />', () => {
  it('should render HeadsetIcon', () => {
    const { container } = renderWithTheme(
      <HeadsetIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
