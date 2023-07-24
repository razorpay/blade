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
    const { queryAllByText, getAllByLabelText } = renderWithTheme(
      <Tag onDismiss={dismissHandler}>in:User</Tag>,
    );
    expect(queryAllByText('in:User')[1]).toBeTruthy();
    fireEvent.press(getAllByLabelText('Close in:User tag')[1]);
    expect(dismissHandler).toBeCalledWith();
  });

  it('should NOT call onDismiss on disabled Tag', () => {
    const dismissHandler = jest.fn();
    const { queryAllByText, getAllByLabelText } = renderWithTheme(
      <Tag onDismiss={dismissHandler} isDisabled={true}>
        in:User
      </Tag>,
    );
    expect(queryAllByText('in:User')[1]).toBeTruthy();
    fireEvent.press(getAllByLabelText('Close in:User tag')[1]);
    expect(dismissHandler).not.toBeCalled();
  });
});
