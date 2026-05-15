import renderWithTheme from '~utils/testing/renderWithTheme.web';

import UploadIcon from './';

describe('<UploadIcon />', () => {
  it('should render UploadIcon', () => {
    const { container } = renderWithTheme(
      <UploadIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
