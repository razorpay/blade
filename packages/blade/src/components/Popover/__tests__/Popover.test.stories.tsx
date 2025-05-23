/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import React from 'react';
import type { PopoverProps, PopoverTriggerProps } from '..';
import { PopoverInteractiveWrapper, Popover as PopoverComponent } from '..';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import { Badge } from '~components/Badge';
import BaseBox from '~components/Box/BaseBox';

const onOpenChange = jest.fn();

const PopoverExample = (props: PopoverProps): React.ReactElement => {
  return (
    <PopoverComponent {...props}>
      <Button>Show Popover</Button>
    </PopoverComponent>
  );
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const TestPopoverOpenClose: StoryFn<typeof PopoverComponent> = (
  props,
): React.ReactElement => {
  onOpenChange.mockReset();
  return <PopoverExample {...props} onOpenChange={onOpenChange} />;
};

TestPopoverOpenClose.args = {
  title: 'Hello World',
  content: <Text>Some text</Text>,
};
TestPopoverOpenClose.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  await expect(queryByText('Hello World')).not.toBeInTheDocument();
  const showButton = getByRole('button', { name: 'Show Popover' });
  // open
  await userEvent.click(showButton);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Hello World')).toBeVisible();
  // close
  const closeButton = getByRole('button', { name: 'Close' });
  await expect(closeButton).toHaveFocus();
  await userEvent.click(closeButton);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: false });
  await expect(queryByText('Hello World')).not.toBeInTheDocument();
  await expect(showButton).toHaveFocus();
  await expect(onOpenChange).toBeCalledTimes(2);
};

// Controlled
export const TestPopoverControlled: StoryFn<typeof PopoverComponent> = (): React.ReactElement => {
  const [isOpen, setIsOpen] = React.useState(true);
  const toggle = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <Box>
      <PopoverComponent
        content={
          <Box>
            <Text>Hello World</Text>
            <Button onClick={toggle}>Internal Click</Button>
          </Box>
        }
        isOpen={isOpen}
        onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
      >
        <Button onClick={() => setIsOpen(true)}>Open Button</Button>
      </PopoverComponent>
      <Button onClick={toggle}>Controlled Show</Button>
    </Box>
  );
};

TestPopoverControlled.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const popoverContent = 'Hello World';
  const toggleButton = getByRole('button', { name: 'Controlled Show', hidden: true });
  const internalButton = getByRole('button', { name: 'Internal Click', hidden: true });

  await sleep(1000);
  // open by default
  await expect(queryByText(popoverContent)).toBeVisible();
  // close
  await userEvent.click(internalButton);
  await sleep(1000);
  await expect(queryByText(popoverContent)).not.toBeInTheDocument();
  // open again
  await userEvent.click(toggleButton);
  await sleep(400);
  await expect(queryByText(popoverContent)).toBeVisible();
  // close via close button
  const closeButton = getByRole('button', { name: 'Close' });
  await expect(closeButton).toHaveFocus();
  await userEvent.click(closeButton);
  await sleep(400);
  await expect(queryByText(popoverContent)).not.toBeInTheDocument();
  await expect(toggleButton).toHaveFocus();
};

// Uncontrolled
export const TestPopoverUncontrolled: StoryFn<typeof PopoverComponent> = (): React.ReactElement => {
  return (
    <Box>
      <PopoverComponent
        content={<Text>Hello World</Text>}
        defaultIsOpen={true}
        onOpenChange={onOpenChange}
      >
        <Button>Show Popover</Button>
      </PopoverComponent>
    </Box>
  );
};

TestPopoverUncontrolled.play = async () => {
  onOpenChange.mockReset();
  const { getByRole, queryByText } = within(document.body);
  const popoverContent = 'Hello World';
  const toggleButton = getByRole('button', { name: 'Show Popover', hidden: true });

  await expect(onOpenChange).not.toBeCalled();
  await sleep(600);
  // open by default
  await expect(queryByText(popoverContent)).toBeVisible();
  // close
  await userEvent.click(toggleButton);
  await sleep(400);
  await expect(queryByText(popoverContent)).not.toBeInTheDocument();
  await expect(onOpenChange).toBeCalledWith({ isOpen: false });
  // open
  await userEvent.click(toggleButton);
  await sleep(400);
  await expect(queryByText(popoverContent)).toBeVisible();
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(onOpenChange).toBeCalledTimes(2);
};

// PopoverInteractiveWrapper
export const TestPopoverInteractiveWrapper: StoryFn<
  typeof PopoverComponent
> = (): React.ReactElement => {
  onOpenChange.mockReset();
  return (
    <PopoverComponent content={<Text>New Badge Content</Text>} onOpenChange={onOpenChange}>
      <PopoverInteractiveWrapper>
        <Badge>NEW</Badge>
      </PopoverInteractiveWrapper>
    </PopoverComponent>
  );
};

TestPopoverInteractiveWrapper.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const popoverContent = 'New Badge Content';
  await expect(queryByText(popoverContent)).not.toBeInTheDocument();
  const badge = getByRole('button', { name: 'NEW' });
  // open
  await userEvent.click(badge);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText(popoverContent)).toBeVisible();
  // close
  const closeButton = getByRole('button', { name: 'Close' });
  await expect(closeButton).toHaveFocus();
  await userEvent.click(closeButton);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: false });
  await expect(queryByText(popoverContent)).not.toBeInTheDocument();
  await expect(badge).toHaveFocus();
  await expect(onOpenChange).toBeCalledTimes(2);
};

// Custom Trigger
const MyCustomTriggerButton = React.forwardRef<
  HTMLDivElement,
  { children: string } & PopoverTriggerProps
>(({ children, onTouchEnd, ...props }, ref) => {
  return (
    // just spread the props
    <BaseBox
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      borderRadius="medium"
      role="button"
      tabIndex={0}
      ref={ref}
      style={{ cursor: 'pointer' }}
      {...props}
    >
      {children}
    </BaseBox>
  );
});

export const TestCustomTrigger: StoryFn<typeof PopoverComponent> = (): React.ReactElement => {
  onOpenChange.mockReset();
  return (
    <PopoverComponent content={<Text>Hello Custom Trigger</Text>} onOpenChange={onOpenChange}>
      <MyCustomTriggerButton>Show Popover</MyCustomTriggerButton>
    </PopoverComponent>
  );
};
TestCustomTrigger.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const popoverContent = 'Hello Custom Trigger';
  await expect(queryByText(popoverContent)).not.toBeInTheDocument();
  const badge = getByRole('button', { name: 'Show Popover' });
  // open
  await userEvent.click(badge);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText(popoverContent)).toBeVisible();
  // close
  const closeButton = getByRole('button', { name: 'Close' });
  await expect(closeButton).toHaveFocus();
  await userEvent.click(closeButton);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: false });
  await expect(queryByText(popoverContent)).not.toBeInTheDocument();
  await expect(badge).toHaveFocus();
  await expect(onOpenChange).toBeCalledTimes(2);
};

export const TestInitialFocus: StoryFn<typeof PopoverComponent> = (): React.ReactElement => {
  onOpenChange.mockReset();
  const initialRef = React.useRef(null);
  return (
    <PopoverComponent
      initialFocusRef={initialRef}
      defaultIsOpen
      content={
        <Box>
          <Text>Hello Initial Focus</Text>
          <Button ref={initialRef}>Focus on me</Button>
        </Box>
      }
    >
      <Button>Show Popover</Button>
    </PopoverComponent>
  );
};
TestInitialFocus.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const popoverContent = 'Hello Initial Focus';
  await sleep(600);
  await expect(queryByText(popoverContent)).toBeVisible();
  const focusedButton = getByRole('button', { name: 'Focus on me' });
  await expect(focusedButton).toHaveFocus();
};

export default {
  title: 'Components/Interaction Tests/Popover',
  component: PopoverComponent,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
  },
};
