import InfoIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<InfoIcon />', () => {
  it('should render InfoIcon', () => {
    const { container } = renderWithTheme(
      <InfoIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
