/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import userEvents from '@testing-library/user-event';
import React from 'react';
import { Tag } from '../Tag';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Tag />', () => {
  it('should render tag', () => {
    const { container } = renderWithTheme(
      <Tag
        onDismiss={() => {
          console.log('tag dismissed');
        }}
      >
        in:User
      </Tag>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should call onDismiss', async () => {
    const user = userEvents.setup();
    const dismissHandler = jest.fn();
    const { getByRole, queryByText } = renderWithTheme(
      <Tag onDismiss={dismissHandler}>in:User</Tag>,
    );
    expect(queryByText('in:User')).toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Close in:User tag' }));
    expect(dismissHandler).toBeCalledWith();
  });

  it('should NOT call onDismiss on disabled Tag', async () => {
    const user = userEvents.setup();
    const dismissHandler = jest.fn();
    const { getByRole, queryByText } = renderWithTheme(
      <Tag onDismiss={dismissHandler} isDisabled={true}>
        in:User
      </Tag>,
    );
    expect(queryByText('in:User')).toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Close in:User tag' }));
    expect(dismissHandler).not.toBeCalled();
  });
});
