import CloudLightningIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CloudLightningIcon />', () => {
  it('should render CloudLightningIcon', () => {
    const { container } = renderWithTheme(
      <CloudLightningIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
