import ArrowDownRightIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ArrowDownRightIcon />', () => {
  it('should render ArrowDownRightIcon', () => {
    const { container } = renderWithTheme(
      <ArrowDownRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
