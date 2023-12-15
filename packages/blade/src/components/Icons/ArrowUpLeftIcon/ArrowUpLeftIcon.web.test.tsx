import ArrowUpLeftIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowUpLeftIcon />', () => {
  it('should render ArrowUpLeftIcon', () => {
    const { container } = renderWithTheme(
      <ArrowUpLeftIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
