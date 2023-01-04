import ArrowDownLeftIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ArrowDownLeftIcon />', () => {
  it('should render ArrowDownLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowDownLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
