import ArrowDownLeftIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowDownLeftIcon />', () => {
  it('should render ArrowDownLeftIcon', () => {
    const { container } = renderWithTheme(
      <ArrowDownLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
