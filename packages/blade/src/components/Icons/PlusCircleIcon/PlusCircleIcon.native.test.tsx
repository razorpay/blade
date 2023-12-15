import PlusCircleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PlusCircleIcon />', () => {
  it('should render PlusCircleIcon', () => {
    const renderTree = renderWithTheme(
      <PlusCircleIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
