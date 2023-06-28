import UploadIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<UploadIcon />', () => {
  it('should render UploadIcon', () => {
    const renderTree = renderWithTheme(
      <UploadIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
