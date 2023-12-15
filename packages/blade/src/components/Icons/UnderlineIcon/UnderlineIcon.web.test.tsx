import UnderlineIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UnderlineIcon />', () => {
  it('should render UnderlineIcon', () => {
    const { container } = renderWithTheme(
      <UnderlineIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
