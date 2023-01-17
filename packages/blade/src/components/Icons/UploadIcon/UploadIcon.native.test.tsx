import UploadIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<UploadIcon />', () => {
  it('should render UploadIcon', () => {
    const renderTree = renderWithTheme(
      <UploadIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
