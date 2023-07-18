import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Tag } from '../Tag';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Tag />', () => {
  it('should render tag', () => {
    const { toJSON } = renderWithTheme(
      <Tag
        onDismiss={() => {
          console.log('tag dismissed');
        }}
      >
        in:User
      </Tag>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should remove tag and call onDismiss', () => {
    const dismissHandler = jest.fn();
    const { queryByText, getByLabelText } = renderWithTheme(
      <Tag onDismiss={dismissHandler}>in:User</Tag>,
    );
    expect(queryByText('in:User')).toBeTruthy();
    fireEvent.press(getByLabelText('Close in:User tag'));
    expect(queryByText('in:User')).not.toBeTruthy();
    expect(dismissHandler).toBeCalledWith({ value: 'in:User' });
  });

  it('should NOT remove tag or call onDismiss on disabled Tag', () => {
    const dismissHandler = jest.fn();
    const { queryByText, getByLabelText } = renderWithTheme(
      <Tag onDismiss={dismissHandler} isDisabled={true}>
        in:User
      </Tag>,
    );
    expect(queryByText('in:User')).toBeTruthy();
    fireEvent.press(getByLabelText('Close in:User tag'));
    expect(queryByText('in:User')).toBeTruthy();
    expect(dismissHandler).not.toBeCalled();
  });
});
