import ArrowUpLeftIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ArrowUpLeftIcon />', () => {
  it('should render ArrowUpLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowUpLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
