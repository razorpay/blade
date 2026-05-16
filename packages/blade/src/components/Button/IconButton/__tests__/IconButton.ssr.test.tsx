/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { CloseIcon } from '~components/Icons';
import { IconButton } from '..';

describe('<IconButton />', () => {
  it('should render', () => {
    const noop = () => {};
    const a11yLabel = 'Close modal';
    const { container, getByLabelText } = renderWithSSR(
      <IconButton accessibilityLabel={a11yLabel} icon={CloseIcon} onClick={noop} />,
    );
    const iconButton = getByLabelText(a11yLabel);

    expect(iconButton).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
