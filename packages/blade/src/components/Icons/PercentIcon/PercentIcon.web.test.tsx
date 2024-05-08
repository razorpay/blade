import PercentIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PercentIcon />', () => {
  it('should render PercentIcon', () => {
    const { container } = renderWithTheme(
      <PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
