import DropletIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<DropletIcon />', () => {
  it('should render DropletIcon', () => {
    const { container } = renderWithTheme(
      <DropletIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
