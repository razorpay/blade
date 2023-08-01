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

  it('should call onDismiss', () => {
    const dismissHandler = jest.fn();
    const { queryByText, getByLabelText } = renderWithTheme(
      <Tag onDismiss={dismissHandler}>in:User</Tag>,
    );
    expect(queryByText('in:User')).toBeTruthy();
    fireEvent.press(getByLabelText('Close in:User tag'));
    expect(dismissHandler).toBeCalledWith();
  });

  it('should NOT call onDismiss on disabled Tag', () => {
    const dismissHandler = jest.fn();
    const { queryByText, getByLabelText } = renderWithTheme(
      <Tag onDismiss={dismissHandler} isDisabled={true}>
        in:User
      </Tag>,
    );
    expect(queryByText('in:User')).toBeTruthy();
    fireEvent.press(getByLabelText('Close in:User tag'));
    expect(dismissHandler).not.toBeCalled();
  });
});
