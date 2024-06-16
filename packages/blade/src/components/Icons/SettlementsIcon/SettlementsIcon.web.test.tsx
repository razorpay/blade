import SettlementsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SettlementsIcon />', () => {
  it('should render SettlementsIcon', () => {
    const { container } = renderWithTheme(
      <SettlementsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
