import DisbursePaymentsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DisbursePaymentsIcon />', () => {
  it('should render DisbursePaymentsIcon', () => {
    const { container } = renderWithTheme(
      <DisbursePaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
