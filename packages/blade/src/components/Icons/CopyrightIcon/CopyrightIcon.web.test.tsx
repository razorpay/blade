import CopyrightIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CopyrightIcon />', () => {
  it('should render CopyrightIcon', () => {
    const { container } = renderWithTheme(
      <CopyrightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
