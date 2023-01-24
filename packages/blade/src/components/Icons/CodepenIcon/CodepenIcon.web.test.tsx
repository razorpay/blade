import CodepenIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CodepenIcon />', () => {
  it('should render CodepenIcon', () => {
    const { container } = renderWithTheme(
      <CodepenIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
