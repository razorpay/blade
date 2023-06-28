import FlagIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FlagIcon />', () => {
  it('should render FlagIcon', () => {
    const renderTree = renderWithTheme(
      <FlagIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
