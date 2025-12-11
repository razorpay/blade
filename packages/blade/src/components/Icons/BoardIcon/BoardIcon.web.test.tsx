import BoardIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BoardIcon />', () => {
  it('should render BoardIcon', () => {
    const { container } = renderWithTheme(
      <BoardIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
