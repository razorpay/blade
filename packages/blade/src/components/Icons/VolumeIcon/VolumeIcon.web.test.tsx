import renderWithTheme from '~utils/testing/renderWithTheme.web';

import VolumeIcon from './';

describe('<VolumeIcon />', () => {
  it('should render VolumeIcon', () => {
    const { container } = renderWithTheme(
      <VolumeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
