import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import RupeeIcon from '.';

describe('<RupeeIcon />', () => {
  it('should render RupeeIcon', () => {
    const { container } = renderWithTheme(
      <RupeeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
