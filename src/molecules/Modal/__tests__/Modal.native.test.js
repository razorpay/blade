import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../../_helpers/testing';
import Modal from '../Modal.native';
import Text from '../../../atoms/Text';

describe('<Modal />', () => {
  describe('centered Modal', () => {
    it('onClose callback is not passed', () => {
      const { container, queryByTestId } = renderWithTheme(
        <Modal visible={true}>
          <Modal.Header>
            <Text>Title</Text>
          </Modal.Header>
          <Modal.Content>
            <Text>Content</Text>
          </Modal.Content>
          <Modal.Footer>
            <Text>Footer</Text>
          </Modal.Footer>
        </Modal>,
      );
      const crossButton = queryByTestId('close-button');
      expect(crossButton).toBeFalsy();
      expect(container).toMatchSnapshot();
    });

    it('onClose callback is passed', () => {
      const mockedOnClose = jest.fn();
      const { container, getByTestId } = renderWithTheme(
        <Modal visible={true} onClose={mockedOnClose}>
          <Modal.Header>
            <Text>Title</Text>
          </Modal.Header>
          <Modal.Content>
            <Text>Content</Text>
          </Modal.Content>
          <Modal.Footer>
            <Text>Footer</Text>
          </Modal.Footer>
        </Modal>,
      );
      const crossButton = getByTestId('close-button');
      fireEvent.press(crossButton);
      expect(mockedOnClose).toHaveBeenCalledTimes(1);
      expect(crossButton).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });

  it('renders fullscreen Modal', () => {
    const mockedOnClose = jest.fn();
    const { container, getByTestId } = renderWithTheme(
      <Modal visible={true} type="fullscreen" onClose={mockedOnClose}>
        <Modal.Header>
          <Text>Title</Text>
        </Modal.Header>
        <Modal.Content>
          <Text>Content</Text>
        </Modal.Content>
      </Modal>,
    );
    const crossButton = getByTestId('close-button');
    fireEvent.press(crossButton);
    expect(mockedOnClose).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
  });

  it('renders bottomsheet Modal', () => {
    const { container } = renderWithTheme(
      <Modal visible={true} type="bottomsheet">
        <Modal.Header>
          <Text>Title</Text>
        </Modal.Header>
        <Modal.Content>
          <Text>Content</Text>
        </Modal.Content>
        <Modal.Footer>
          <Text>Footer</Text>
        </Modal.Footer>
      </Modal>,
    );
    expect(container).toMatchSnapshot();
  });
});
