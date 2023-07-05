import VolumeIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<VolumeIcon />', () => {
  it('should render VolumeIcon', () => {
    const { container } = renderWithTheme(
      <VolumeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
