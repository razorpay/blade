import React from 'react';
import { Avatar } from '../Avatar';
import { AvatarGroup } from '../AvatarGroup';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<AvatarGroup />', () => {
  it(`should render AvatarGroup `, () => {
    const { container } = renderWithSSR(
      <AvatarGroup>
        <Avatar name="Nitin Kumar" color="information" />
        <Avatar name="Anurag" color="positive" />
        <Avatar name="Rama Krushna Behra" color="negative" />
        <Avatar name="Chaitanya" color="primary" />
        <Avatar name="Saurav" color="positive" />
      </AvatarGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent('NK');
    expect(container).toHaveTextContent('AN');
    expect(container).toHaveTextContent('RB');
  });
});
