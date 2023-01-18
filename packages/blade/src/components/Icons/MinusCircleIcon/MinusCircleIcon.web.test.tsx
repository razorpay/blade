import MinusCircleIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MinusCircleIcon />', () => {
  it('should render MinusCircleIcon', () => {
    const { container } = renderWithTheme(
      <MinusCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
