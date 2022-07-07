import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import InfoIcon from '.';

describe('<InfoIcon />', () => {
  it('should render InfoIcon', () => {
    const { container } = renderWithTheme(
      <InfoIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
