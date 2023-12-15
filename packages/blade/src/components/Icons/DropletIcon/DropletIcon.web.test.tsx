import DropletIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DropletIcon />', () => {
  it('should render DropletIcon', () => {
    const { container } = renderWithTheme(
      <DropletIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
