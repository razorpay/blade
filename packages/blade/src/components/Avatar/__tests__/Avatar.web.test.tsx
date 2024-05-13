import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { Avatar, AvatarProps } from '../Avatar.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { InfoIcon } from '~components/Icons';
import assertAccessible from '~utils/testing/assertAccessible.native';
import { Box } from '~components/Box';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';

const sizes: AvatarProps['size'][] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
const colors: AvatarProps['color'][] = [
  'primary',
  'neutral',
  'positive',
  'negative',
  'notice',
  'information',
];

describe('<Avatar />', () => {
  it('should render default avatar', () => {
    const { container } = renderWithTheme(<Avatar />);
    expect(container).toMatchSnapshot();
  });

  it('should render avatar with correct name initials', () => {
    const { container } = renderWithTheme(
      <Box>
        <Avatar name="Nitin Kumar" />
        <Avatar name="Anurag" />
        <Avatar name="Rama Krushna Behra" />
      </Box>,
    );
    expect(container).toHaveTextContent('NK');
    expect(container).toHaveTextContent('AN');
    expect(container).toHaveTextContent('RB');
  });

  it('should render avatar with img', () => {
    const { getByRole } = renderWithTheme(
      <Avatar name="Nitin Kumar" src="https://avatars.githubusercontent.com/u/46647141?v=4" />,
    );

    const img = getByRole('img');
    expect(img).toHaveAttribute('src', 'https://avatars.githubusercontent.com/u/46647141?v=4');
    expect(img).toHaveAttribute('alt', 'Nitin Kumar');
  });

  it('should respect alt text while rendering avatar with img', () => {
    const { getByRole } = renderWithTheme(
      <Avatar
        name="Nitin Kumar"
        alt="Avatar for Nitin Kumar"
        src="https://avatars.githubusercontent.com/u/46647141?v=4"
      />,
    );

    const img = getByRole('img');
    expect(img).toHaveAttribute('src', 'https://avatars.githubusercontent.com/u/46647141?v=4');
    expect(img).toHaveAttribute('alt', 'Avatar for Nitin Kumar');
  });

  it('should render avatar with icon', () => {
    const { container } = renderWithTheme(<Avatar icon={InfoIcon} />);
    expect(container).toMatchSnapshot();
  });

  sizes.forEach((size) => {
    it(`should render avatar with size ${size}`, () => {
      const { container } = renderWithTheme(<Avatar name="Nitin Kumar" size={size} />);
      expect(container).toMatchSnapshot();
    });
  });

  colors.forEach((color) => {
    it(`should render avatar with color ${color}`, () => {
      const { container } = renderWithTheme(<Avatar name="Nitin Kumar" color={color} />);
      expect(container).toMatchSnapshot();
    });
  });

  it('should render square variant of avatar', () => {
    const { container } = renderWithTheme(<Avatar name="Nitin Kumar" variant="square" />);
    expect(container).toMatchSnapshot();
  });

  it('should render avatar with dropdown', async () => {
    const user = userEvent.setup();
    const { container, queryByRole, getByRole } = renderWithTheme(
      <Dropdown>
        <Avatar name="Nitin Kumar" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Payouts" value="payout" />
            <ActionListItem title="Transactions" value="transactions" />
            <ActionListItem title="Settings" value="settings" />
            <ActionListItem title="Logout" value="logout" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );
    expect(container).toMatchSnapshot();

    const dropdownTrigger = getByRole('button', { name: 'NK' });
    expect(dropdownTrigger).toBeInTheDocument();
    expect(queryByRole('menu')).toBeNull();
    await user.click(dropdownTrigger);
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
  });

  it('should throw error if alt or name prop is not provided with src prop', () => {
    expect(() =>
      renderWithTheme(<Avatar src="https://avatars.githubusercontent.com/u/46647141?v=4" />),
    ).toThrowError(
      '[Blade: Avatar]: "alt" or "name" prop is required when the "src" prop is provided.',
    );
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Avatar name="Nitin Kumar" testID="avatar-test" />);
    expect(getByTestId('avatar-test')).toBeTruthy();
  });

  it('should pass general a11y', async () => {
    const { container } = renderWithTheme(
      <Avatar name="Nitin Kumar" size="large" color="primary" />,
    );

    await assertAccessible(container);
  });
});
