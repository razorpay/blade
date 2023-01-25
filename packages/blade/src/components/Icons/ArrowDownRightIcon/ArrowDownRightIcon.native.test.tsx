import ArrowDownRightIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ArrowDownRightIcon />', () => {
  it('should render ArrowDownRightIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowDownRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
