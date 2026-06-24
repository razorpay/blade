import UpiFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UpiFilledIcon />', () => {
  it('should render UpiFilledIcon', () => {
    const { container } = renderWithTheme(
      <UpiFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
