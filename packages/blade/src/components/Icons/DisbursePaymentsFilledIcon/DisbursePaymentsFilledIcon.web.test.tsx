import DisbursePaymentsFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DisbursePaymentsFilledIcon />', () => {
  it('should render DisbursePaymentsFilledIcon', () => {
    const { container } = renderWithTheme(
      <DisbursePaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
