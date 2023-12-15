import ArrowDownRightIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowDownRightIcon />', () => {
  it('should render ArrowDownRightIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowDownRightIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
