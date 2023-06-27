/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import userEvents from '@testing-library/user-event';
import React from 'react';
import { Tag } from '../Tag';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Tag />', () => {
  it('should render tag', () => {
    const { container } = renderWithTheme(<Tag>in:User</Tag>);
    expect(container).toMatchSnapshot();
  });

  it('should remove tag and call onDismiss', async () => {
    const user = userEvents.setup();
    const dismissHandler = jest.fn();
    const { getByRole, queryByText } = renderWithTheme(
      <Tag onDismiss={dismissHandler}>in:User</Tag>,
    );
    expect(queryByText('in:User')).toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Close in:User tag' }));
    expect(queryByText('in:User')).not.toBeInTheDocument();
    expect(dismissHandler).toBeCalledWith({ value: 'in:User' });
  });
});
