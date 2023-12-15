import AtSignIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AtSignIcon />', () => {
  it('should render AtSignIcon', () => {
    const { container } = renderWithTheme(
      <AtSignIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
