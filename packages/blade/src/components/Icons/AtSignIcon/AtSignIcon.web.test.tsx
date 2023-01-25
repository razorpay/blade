import AtSignIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<AtSignIcon />', () => {
  it('should render AtSignIcon', () => {
    const { container } = renderWithTheme(
      <AtSignIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
