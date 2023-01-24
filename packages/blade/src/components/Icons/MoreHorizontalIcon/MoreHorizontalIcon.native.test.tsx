import MoreHorizontalIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MoreHorizontalIcon />', () => {
  it('should render MoreHorizontalIcon', () => {
    const renderTree = renderWithTheme(
      <MoreHorizontalIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
