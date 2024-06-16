import ArrowRightIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowRightIcon />', () => {
  it('should render ArrowRightIcon', () => {
    const { container } = renderWithTheme(
      <ArrowRightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
