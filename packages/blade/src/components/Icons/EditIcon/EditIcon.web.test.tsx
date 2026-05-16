import renderWithTheme from '~utils/testing/renderWithTheme.web';

import EditIcon from './';

describe('<EditIcon />', () => {
  it('should render EditIcon', () => {
    const { container } = renderWithTheme(
      <EditIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
