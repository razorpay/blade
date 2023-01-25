import AlignCenterIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<AlignCenterIcon />', () => {
  it('should render AlignCenterIcon', () => {
    const { container } = renderWithTheme(
      <AlignCenterIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
