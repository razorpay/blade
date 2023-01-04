import RotateCwIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RotateCwIcon />', () => {
  it('should render RotateCwIcon', () => {
    const renderTree = renderWithTheme(
      <RotateCwIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
