import MoreFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MoreFilledIcon />', () => {
  it('should render MoreFilledIcon', () => {
    const { container } = renderWithTheme(
      <MoreFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
