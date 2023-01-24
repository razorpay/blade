import BillIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BillIcon />', () => {
  it('should render BillIcon', () => {
    const renderTree = renderWithTheme(
      <BillIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
