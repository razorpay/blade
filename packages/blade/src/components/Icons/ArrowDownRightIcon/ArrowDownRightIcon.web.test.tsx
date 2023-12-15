import ArrowDownRightIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowDownRightIcon />', () => {
  it('should render ArrowDownRightIcon', () => {
    const { container } = renderWithTheme(
      <ArrowDownRightIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
