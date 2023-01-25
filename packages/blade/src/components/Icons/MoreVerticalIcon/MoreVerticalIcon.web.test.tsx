import MoreVerticalIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MoreVerticalIcon />', () => {
  it('should render MoreVerticalIcon', () => {
    const { container } = renderWithTheme(
      <MoreVerticalIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
