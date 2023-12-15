import MoreVerticalIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MoreVerticalIcon />', () => {
  it('should render MoreVerticalIcon', () => {
    const { container } = renderWithTheme(
      <MoreVerticalIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
