import renderWithTheme from '~utils/testing/renderWithTheme.web';

import FilePlusIcon from './';

describe('<FilePlusIcon />', () => {
  it('should render FilePlusIcon', () => {
    const { container } = renderWithTheme(
      <FilePlusIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
