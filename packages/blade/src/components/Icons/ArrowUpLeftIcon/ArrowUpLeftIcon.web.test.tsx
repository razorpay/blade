import ArrowUpLeftIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ArrowUpLeftIcon />', () => {
  it('should render ArrowUpLeftIcon', () => {
    const { container } = renderWithTheme(
      <ArrowUpLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
