import BaseBoxIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BaseBoxIcon />', () => {
  it('should render BoxIcon', () => {
    const { container } = renderWithTheme(
      <BaseBoxIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
