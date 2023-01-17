import XCircleIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<XCircleIcon />', () => {
  it('should render XCircleIcon', () => {
    const renderTree = renderWithTheme(
      <XCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
