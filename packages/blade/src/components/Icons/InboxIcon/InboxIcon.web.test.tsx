import InboxIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<InboxIcon />', () => {
  it('should render InboxIcon', () => {
    const { container } = renderWithTheme(
      <InboxIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
