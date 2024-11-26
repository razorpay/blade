import React from 'react';
import { Avatar } from '../Avatar';
import type { AvatarGroupProps } from '../AvatarGroup';
import { AvatarGroup } from '../AvatarGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

const sizes: AvatarGroupProps['size'][] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

describe('<AvatarGroup />', () => {
  sizes.forEach((size) => {
    it(`should render AvatarGroup with size ${size}`, () => {
      const { container } = renderWithTheme(
        <AvatarGroup size={size}>
          <Avatar name="Nitin Kumar" color="information" />
          <Avatar name="Anurag" color="positive" />
          <Avatar name="Rama Krushna Behra" color="negative" />
        </AvatarGroup>,
      );
      expect(container).toMatchSnapshot();
      expect(container).toHaveTextContent('NK');
      expect(container).toHaveTextContent('AN');
      expect(container).toHaveTextContent('RB');
    });
  });

  it('should work with maxCount', () => {
    const { container } = renderWithTheme(
      <AvatarGroup maxCount={3}>
        <Avatar name="Nitin Kumar" color="information" />
        <Avatar name="Anurag" color="positive" />
        <Avatar name="Rama Krushna Behra" color="negative" />
        <Avatar name="Chaitanya" color="primary" />
        <Avatar name="Saurav" color="positive" />
      </AvatarGroup>,
    );
    expect(container).toHaveTextContent('NK');
    expect(container).toHaveTextContent('AN');
    expect(container).toHaveTextContent('RB');
    expect(container).not.toHaveTextContent('CH');
    expect(container).not.toHaveTextContent('SA');
    expect(container).toHaveTextContent('+2');
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <AvatarGroup testID="avatar-group-test">
        <Avatar name="Nitin Kumar" color="information" />
        <Avatar name="Anurag" color="positive" />
        <Avatar name="Rama Krushna Behra" color="negative" />
      </AvatarGroup>,
    );
    expect(getByTestId('avatar-group-test')).toBeTruthy();
  });
  it('should accept data-analytics attribute', () => {
    const { getByTestId, container } = renderWithTheme(
      <AvatarGroup data-analytics-avatar-group="blade-team" testID="data-analytics-test">
        <Avatar name="Nitin Kumar" color="information" />
        <Avatar name="Anurag" color="positive" />
        <Avatar name="Rama Krushna Behra" color="negative" />
      </AvatarGroup>,
    );
    expect(getByTestId('data-analytics-test')).toHaveAttribute(
      'data-analytics-avatar-group',
      'blade-team',
    );
    expect(container).toMatchSnapshot();
  });
});
