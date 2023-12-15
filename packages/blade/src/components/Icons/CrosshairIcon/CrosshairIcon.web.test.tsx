import CrosshairIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CrosshairIcon />', () => {
  it('should render CrosshairIcon', () => {
    const { container } = renderWithTheme(
      <CrosshairIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
