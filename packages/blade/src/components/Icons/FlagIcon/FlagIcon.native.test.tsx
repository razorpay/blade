import FlagIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<FlagIcon />', () => {
  it('should render FlagIcon', () => {
    const renderTree = renderWithTheme(
      <FlagIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
