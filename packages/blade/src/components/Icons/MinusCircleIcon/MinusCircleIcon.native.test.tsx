import MinusCircleIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MinusCircleIcon />', () => {
  it('should render MinusCircleIcon', () => {
    const renderTree = renderWithTheme(
      <MinusCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
