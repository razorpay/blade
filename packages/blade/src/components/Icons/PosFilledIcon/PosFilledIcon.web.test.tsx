import PosFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PosFilledIcon />', () => {
  it('should render PosFilledIcon', () => {
    const { container } = renderWithTheme(
      <PosFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
