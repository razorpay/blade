import RupeesIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RupeesIcon />', () => {
  it('should render RupeesIcon', () => {
    const { container } = renderWithTheme(
      <RupeesIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
