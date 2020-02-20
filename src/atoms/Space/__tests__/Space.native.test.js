import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';

import Space from '../index';

describe('Renders <Space /> correctly', () => {
  it('Space, by default renders a View', () => {
    const { container, getByTestId } = render(<Space padding={[1, 2]} />);
    const view = getByTestId('space-default-view');
    expect(view).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders a View with margin', () => {
    const { container } = render(
      <Space margin={[5, 5]}>
        <View />
      </Space>,
    );
    expect(container).toMatchSnapshot();
  });
});
