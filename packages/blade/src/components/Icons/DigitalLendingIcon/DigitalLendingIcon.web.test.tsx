import DigitalLendingIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DigitalLendingIcon />', () => {
  it('should render DigitalLendingIcon', () => {
    const { container } = renderWithTheme(
      <DigitalLendingIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
