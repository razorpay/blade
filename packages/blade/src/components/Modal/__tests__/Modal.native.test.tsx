/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Modal, ModalBody } from '../Modal';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import { Text } from '~components/Typography';

describe('Modal', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders proper information on unavailability of Modal on native', () => {
    const { getByText } = renderWithTheme(
      <Modal isOpen={true} onDismiss={() => {}} accessibilityLabel="Test Modal">
        <ModalBody>
          <Text>Test Content</Text>
        </ModalBody>
      </Modal>,
    );
    expect(
      getByText(
        'Modal Component is not available for Native mobile apps and we should use BottomSheet component instead for all use-cases of Modal on Native mobile apps.',
      ),
    ).toBeTruthy();
    expect(console.warn).toHaveBeenCalledWith(
      '[Blade Modal] Modal is not supported on mobile devices. Please use BottomSheet instead.',
    );
  });
});
