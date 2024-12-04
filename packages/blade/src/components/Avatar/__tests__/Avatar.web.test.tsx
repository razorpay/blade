import React from 'react';
import type { AvatarProps } from '../Avatar.web';
import { Avatar } from '../Avatar.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { InfoIcon } from '~components/Icons';
import assertAccessible from '~utils/testing/assertAccessible.native';
import { Box } from '~components/Box';

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
    const { getAllByRole } = renderWithTheme(
      <Box>
        <Avatar onClick={() => console.log('click')} name="Nitin Kumar" />
        <Avatar onClick={() => console.log('click')} name="Anurag" />
        <Avatar onClick={() => console.log('click')} name="Rama Krushna Behra" />
      </Box>,
    );
    const [avatar1, avatar2, avatar3] = getAllByRole('button');
    expect(avatar1).toHaveTextContent('NK');
    expect(avatar2).toHaveTextContent('AN');
    expect(avatar3).toHaveTextContent('RB');
  });

  it('should render avatar with img', () => {
    const { getByRole } = renderWithTheme(
      <Avatar name="Nitin Kumar" src="https://avatars.githubusercontent.com/u/46647141?v=4" />,
    );

    const img = getByRole('img');
    expect(img).toHaveAttribute('src', 'https://avatars.githubusercontent.com/u/46647141?v=4');
    expect(img).toHaveAttribute('alt', 'Nitin Kumar');
  });

  it('should respect img attributes while rendering avatar with img', () => {
    const alt = 'Avatar for Nitin Kumar';
    const src = 'https://avatars.githubusercontent.com/u/46647141?v=4';
    const srcSet =
      'https://avatars.githubusercontent.com/u/46647141?v=4 1x, https://avatars.githubusercontent.com/u/46647141?v=4 2x';
    const crossOrigin = 'anonymous';
    const referrerPolicy = 'no-referrer';
    const { getByRole } = renderWithTheme(
      <Avatar
        name="Nitin Kumar"
        alt={alt}
        src={src}
        srcSet={srcSet}
        crossOrigin={crossOrigin}
        referrerPolicy={referrerPolicy}
      />,
    );

    const img = getByRole('img');
    expect(img).toHaveAttribute('src', src);
    expect(img).toHaveAttribute('srcSet', srcSet);
    expect(img).toHaveAttribute('alt', alt);
    expect(img).toHaveAttribute('crossOrigin', crossOrigin);
    expect(img).toHaveAttribute('referrerPolicy', referrerPolicy);
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

  it('should render avatar as link', () => {
    const { getByRole } = renderWithTheme(
      <Avatar href="https://youtu.be/iPaBUhIsslA" target="_blank" name="Nitin Kumar" />,
    );
    expect(getByRole('link').tagName).toBe('A');
    expect(getByRole('link')).toHaveAttribute('href', 'https://youtu.be/iPaBUhIsslA');
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(getByRole('link')).toHaveAttribute('rel', 'noreferrer noopener');
  });

  it('should be able to override rel prop', () => {
    const { getByRole } = renderWithTheme(
      <Avatar
        href="https://youtu.be/iPaBUhIsslA"
        target="_blank"
        name="Nitin Kumar"
        rel="noopener"
      />,
    );
    expect(getByRole('link')).toHaveAttribute('rel', 'noopener');
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
  it('should pass with data-analytics attribute', () => {
    const { getByTestId } = renderWithTheme(
      <Avatar name="Nitin Kumar" testID="avatar-test" data-analytics-test="test" />,
    );
    expect(getByTestId('avatar-test')).toHaveAttribute('data-analytics-test', 'test');
  });
});
