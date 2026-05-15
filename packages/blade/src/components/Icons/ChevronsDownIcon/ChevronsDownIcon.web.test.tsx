import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ChevronsDownIcon from './';

describe('<ChevronsDownIcon />', () => {
  it('should render ChevronsDownIcon', () => {
    const { container } = renderWithTheme(
      <ChevronsDownIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
