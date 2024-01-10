import CompassIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CompassIcon />', () => {
  it('should render CompassIcon', () => {
    const { container } = renderWithTheme(
      <CompassIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
