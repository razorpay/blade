import AlertCircleIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<AlertCircleIcon />', () => {
  it('should render AlertCircleIcon', () => {
    const renderTree = renderWithTheme(
      <AlertCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
