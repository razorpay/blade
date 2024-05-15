import TestIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TestIcon />', () => {
  it('should render TestIcon', () => {
    const { container } = renderWithTheme(
      <TestIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
