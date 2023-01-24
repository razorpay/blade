import AwardIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<AwardIcon />', () => {
  it('should render AwardIcon', () => {
    const renderTree = renderWithTheme(
      <AwardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
