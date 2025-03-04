import DragHandleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DragHandleIcon />', () => {
  it('should render DragHandleIcon', () => {
    const { container } = renderWithTheme(
      <DragHandleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
