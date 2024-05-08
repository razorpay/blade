import ArrowDownIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowDownIcon />', () => {
  it('should render ArrowDownIcon', () => {
    const { container } = renderWithTheme(
      <ArrowDownIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
