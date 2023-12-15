import GlobeIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<GlobeIcon />', () => {
  it('should render GlobeIcon', () => {
    const { container } = renderWithTheme(
      <GlobeIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
