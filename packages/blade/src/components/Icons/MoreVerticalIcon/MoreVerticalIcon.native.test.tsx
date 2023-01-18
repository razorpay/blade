import MoreVerticalIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MoreVerticalIcon />', () => {
  it('should render MoreVerticalIcon', () => {
    const renderTree = renderWithTheme(
      <MoreVerticalIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
