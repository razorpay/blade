import TrashIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TrashIcon />', () => {
  it('should render TrashIcon', () => {
    const { container } = renderWithTheme(
      <TrashIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
