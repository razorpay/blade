import EngageFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<EngageFilledIcon />', () => {
  it('should render EngageFilledIcon', () => {
    const { container } = renderWithTheme(
      <EngageFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
