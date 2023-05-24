/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */

import userEvent from '@testing-library/user-event';

import { IconButton } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { CloseIcon } from '~components/Icons';

describe('<IconButton />', () => {
  it('should render', () => {
    const noop = () => {};
    const { container } = renderWithTheme(
      <IconButton accessibilityLabel="Close" icon={CloseIcon} onClick={noop} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should handle onClick', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <IconButton accessibilityLabel="Close" icon={CloseIcon} onClick={onClick} />,
    );
    const iconButton = getByRole('button');
    await user.click(iconButton);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not submit form', async () => {
    const noop = () => {};
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const { getByRole } = renderWithTheme(
      <form onSubmit={onSubmit}>
        <IconButton accessibilityLabel="Close" icon={CloseIcon} onClick={noop} />,
      </form>,
    );
    const iconButton = getByRole('button');
    await user.click(iconButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should have a11y label', () => {
    const noop = () => {};
    const a11yLabel = 'Close modal';
    const { getByLabelText } = renderWithTheme(
      <IconButton accessibilityLabel={a11yLabel} icon={CloseIcon} onClick={noop} />,
    );
    const iconButton = getByLabelText(a11yLabel);

    expect(iconButton).toBeTruthy();
  });

  it('should pass a11y', async () => {
    const noop = () => {};
    const { getByRole } = renderWithTheme(
      <IconButton accessibilityLabel="Close" icon={CloseIcon} onClick={noop} />,
    );
    const iconButton = getByRole('button');

    await assertAccessible(iconButton);
  });
});
