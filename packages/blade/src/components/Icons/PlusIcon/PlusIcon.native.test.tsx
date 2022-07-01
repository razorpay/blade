import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import PlusIcon from '.';

describe('<PlusIcon />', () => {
  it('should render PlusIcon', () => {
    const renderTree = renderWithTheme(
      <PlusIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
