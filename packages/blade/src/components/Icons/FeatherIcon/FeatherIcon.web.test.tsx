import FeatherIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FeatherIcon />', () => {
  it('should render FeatherIcon', () => {
    const { container } = renderWithTheme(
      <FeatherIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
