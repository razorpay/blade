/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */

import { fireEvent } from '@testing-library/react-native';

import { IconButton } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { CloseIcon } from '~components/Icons';

describe('<IconButton />', () => {
  it('should render', () => {
    const noop = () => {};
    const { toJSON } = renderWithTheme(
      <IconButton accessibilityLabel="Close" icon={CloseIcon} onClick={noop} />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle onClick', () => {
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <IconButton accessibilityLabel="Close" icon={CloseIcon} onClick={onClick} />,
    );
    const iconButton = getByRole('button');
    fireEvent.press(iconButton);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should have a11y label', () => {
    const noop = () => {};
    const a11yLabel = 'Close modal';
    const { getByA11yLabel } = renderWithTheme(
      <IconButton accessibilityLabel={a11yLabel} icon={CloseIcon} onClick={noop} />,
    );
    const iconButton = getByA11yLabel(a11yLabel);

    expect(iconButton).toBeTruthy();
  });
});
