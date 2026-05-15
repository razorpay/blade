import renderWithTheme from '~utils/testing/renderWithTheme.web';

import DeleteIcon from './';

describe('<DeleteIcon />', () => {
  it('should render DeleteIcon', () => {
    const { container } = renderWithTheme(
      <DeleteIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
