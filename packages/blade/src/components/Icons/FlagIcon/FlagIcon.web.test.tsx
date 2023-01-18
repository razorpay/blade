import FlagIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<FlagIcon />', () => {
  it('should render FlagIcon', () => {
    const { container } = renderWithTheme(
      <FlagIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
