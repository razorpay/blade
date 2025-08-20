import ForexManagementFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ForexManagementFilledIcon />', () => {
  it('should render ForexManagementFilledIcon', () => {
    const { container } = renderWithTheme(
      <ForexManagementFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
