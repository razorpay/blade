import ForexManagementIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ForexManagementIcon />', () => {
  it('should render ForexManagementIcon', () => {
    const { container } = renderWithTheme(
      <ForexManagementIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
