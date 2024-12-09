/* eslint-disable @typescript-eslint/no-empty-function */
import userEvents from '@testing-library/user-event';
import { fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../Modal';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Badge } from '~components/Badge';
import { Counter } from '~components/Counter';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';

describe('Modal', () => {
  it('renders a basic Modal', () => {
    const { getByTestId } = renderWithTheme(
      <Modal isOpen={true} onDismiss={() => {}} accessibilityLabel="Test Modal">
        <ModalBody>
          <Text>Test Content</Text>
        </ModalBody>
      </Modal>,
    );
    const container = getByTestId('modal-wrapper');
    expect(container).toMatchSnapshot();
  });

  it('renders a basic Modal of medium size', () => {
    const { getByTestId } = renderWithTheme(
      <Modal isOpen={true} onDismiss={() => {}} accessibilityLabel="Test Modal" size="medium">
        <ModalBody>
          <Text>Test Content</Text>
        </ModalBody>
      </Modal>,
    );
    const container = getByTestId('modal-wrapper');
    expect(container).toMatchSnapshot();
  });

  it('renders a basic Modal of large size', () => {
    const { getByTestId } = renderWithTheme(
      <Modal isOpen={true} onDismiss={() => {}} accessibilityLabel="Test Modal" size="large">
        <ModalBody>
          <Text>Test Content</Text>
        </ModalBody>
      </Modal>,
    );
    const container = getByTestId('modal-wrapper');
    expect(container).toMatchSnapshot();
  });

  it('renders a Modal with Header and Footer', () => {
    const { getByTestId } = renderWithTheme(
      <Modal isOpen={true} onDismiss={() => {}} accessibilityLabel="Test Modal">
        <ModalHeader
          title="Address Details"
          subtitle="Saving addresses will improve your checkout experience"
          trailing={<Badge color="notice">Action Needed</Badge>}
          titleSuffix={<Counter color="positive" value={2} />}
        />
        <ModalBody>
          <Text>Test Content</Text>
        </ModalBody>
        <ModalFooter>
          <Button>Save</Button>
        </ModalFooter>
      </Modal>,
    );
    const container = getByTestId('modal-wrapper');
    expect(container).toMatchSnapshot();
  });

  // Skipping initialFocusRef test because while
  // using FloatingFocusManager's logic cause the focus to happen after few frames
  it.skip('should focus on passed initialFocusRef', () => {
    const Element = (): React.ReactElement => {
      const ref = React.useRef(null);
      return (
        <Modal
          isOpen={true}
          onDismiss={() => {}}
          accessibilityLabel="Test Modal"
          size="medium"
          initialFocusRef={ref}
        >
          <ModalBody>
            <Text>Test Content</Text>
          </ModalBody>
          <ModalFooter>
            <Button ref={ref} accessibilityLabel="save">
              Save
            </Button>
          </ModalFooter>
        </Modal>
      );
    };

    const { getByLabelText } = renderWithTheme(<Element />);
    expect(getByLabelText('save')).toHaveFocus();
  });

  it('should handle controlled state of Modal', () => {
    const onDismiss = jest.fn();
    const Element = (): React.ReactElement => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <>
          <Modal
            isOpen={isOpen}
            onDismiss={() => {
              onDismiss();
            }}
            accessibilityLabel="Test Modal"
            size="medium"
          >
            <ModalHeader title="Modal" />
            <ModalBody>
              <Text>Test Content</Text>
            </ModalBody>
          </Modal>
          <Button accessibilityLabel="toggle modal" onClick={() => setIsOpen(true)}>
            Toggle Modal
          </Button>
        </>
      );
    };

    const { getByRole, queryByRole } = renderWithTheme(<Element />);
    fireEvent.click(getByRole('button'));
    expect(queryByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(queryByRole('dialog')!, { key: 'Esc' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should dismiss on overlay click', async () => {
    const user = userEvents.setup();
    const onDismiss = jest.fn();
    const Element = (): React.ReactElement => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <>
          <Modal
            isOpen={isOpen}
            onDismiss={onDismiss}
            accessibilityLabel="Test Modal"
            size="medium"
          >
            <ModalBody>
              <Text>Test Content</Text>
            </ModalBody>
          </Modal>
          <Button accessibilityLabel="toggle modal" onClick={() => setIsOpen(true)}>
            Toggle Modal
          </Button>
        </>
      );
    };

    const { getByRole, getByTestId } = renderWithTheme(<Element />);
    await user.click(getByRole('button'));
    await user.click(getByTestId('modal-backdrop'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should dismiss on close button click', async () => {
    const Element = (): React.ReactElement => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <>
          <Modal
            isOpen={isOpen}
            onDismiss={() => {
              setIsOpen(false);
            }}
            accessibilityLabel="Test Modal"
            size="medium"
          >
            <ModalHeader title="Modal" />
            <ModalBody>
              <Text>Test Content</Text>
            </ModalBody>
          </Modal>
          <Button accessibilityLabel="toggle modal" onClick={() => setIsOpen(true)}>
            Toggle Modal
          </Button>
        </>
      );
    };

    const { getByRole, queryByRole } = renderWithTheme(<Element />);
    fireEvent.click(getByRole('button'));
    fireEvent.click(getByRole('button', { name: 'Close' }));
    await waitForElementToBeRemoved(() => queryByRole('dialog'));
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should dismiss on escape key press', async () => {
    const Element = (): React.ReactElement => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <>
          <Modal
            isOpen={isOpen}
            onDismiss={() => {
              setIsOpen(false);
            }}
            accessibilityLabel="Test Modal"
            size="medium"
          >
            <ModalHeader title="Modal" />
            <ModalBody>
              <Text>Test Content</Text>
            </ModalBody>
          </Modal>
          <Button accessibilityLabel="toggle modal" onClick={() => setIsOpen(true)}>
            Toggle Modal
          </Button>
        </>
      );
    };

    const { getByRole, queryByRole } = renderWithTheme(<Element />);
    fireEvent.click(getByRole('button'));
    fireEvent.keyDown(getByRole('dialog')!, { key: 'Esc' });
    await waitForElementToBeRemoved(() => queryByRole('dialog'));
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should throw error when invalid children are passed', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const Example = (): React.ReactElement => {
      return (
        <Modal isOpen={true} onDismiss={() => {}}>
          <Text>I am not supposed to be here</Text>
        </Modal>
      );
    };
    expect(() => renderWithTheme(<Example />)).toThrow(
      '[Blade: Modal]: Only `ModalHeader, ModalBody, ModalFooter` components are accepted in `Modal` children',
    );
    mockConsoleError.mockRestore();
  });

  it('renders a Modal with custom zIndex', () => {
    const { getByTestId } = renderWithTheme(
      <Modal isOpen={true} onDismiss={() => {}} accessibilityLabel="Test Modal" zIndex={9999}>
        <ModalBody>
          <Text>Test Content</Text>
        </ModalBody>
      </Modal>,
    );
    const container = getByTestId('modal-wrapper');
    expect(container).toHaveStyle({
      zIndex: 9999,
    });
  });

  it('should support adding data-analytics attribute', () => {
    const { getByTestId } = renderWithTheme(
      <Modal
        isOpen={true}
        onDismiss={() => {}}
        accessibilityLabel="Test Modal"
        data-analytics-modal="test-modal"
      >
        <ModalHeader title="Modal" data-analytics-header="title" />

        <ModalBody data-analytics-modal-body="test-body">
          <Text>Test Content</Text>
        </ModalBody>
        <ModalFooter data-analytics-modal-footer="footer">
          <Button accessibilityLabel="save">Save</Button>
        </ModalFooter>
      </Modal>,
    );
    const container = getByTestId('modal-wrapper');
    expect(container).toHaveAttribute('data-analytics-modal');
    expect(container).toHaveAttribute('data-analytics-modal', 'test-modal');
  });
});
