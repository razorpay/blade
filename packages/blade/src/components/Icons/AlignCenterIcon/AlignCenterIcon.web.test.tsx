import AlignCenterIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AlignCenterIcon />', () => {
  it('should render AlignCenterIcon', () => {
    const { container } = renderWithTheme(
      <AlignCenterIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
