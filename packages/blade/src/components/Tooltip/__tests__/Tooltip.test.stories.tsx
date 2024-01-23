import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import React from 'react';
import { TooltipInteractiveWrapper, Tooltip as TooltipComponent } from '..';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import BaseBox from '~components/Box/BaseBox';
import type { BladeCommonEvents } from '~components/types';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const onOpenChange = jest.fn();

export const TestTooltipOpenClose: StoryFn<typeof TooltipComponent> = (
  props,
): React.ReactElement => {
  return (
    <TooltipComponent {...props} onOpenChange={onOpenChange}>
      <Button>Hover me</Button>
    </TooltipComponent>
  );
};

TestTooltipOpenClose.args = {
  content: 'Some text',
};
TestTooltipOpenClose.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const tooltipContent = 'Some text';
  await expect(queryByText(tooltipContent)).not.toBeInTheDocument();
  const showButton = getByRole('button', { name: 'Hover me' });
  // open
  await userEvent.hover(showButton);
  await sleep(600);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText(tooltipContent)).toBeVisible();
  // close
  await userEvent.unhover(showButton);
  await sleep(600);
  await expect(onOpenChange).toBeCalledWith({ isOpen: false });
  await expect(queryByText(tooltipContent)).not.toBeInTheDocument();
};

// TooltipInteractiveWrapper
export const TestTooltipInteractiveWrapper: StoryFn<typeof TooltipComponent> = (
  props,
): React.ReactElement => {
  onOpenChange.mockReset();
  return (
    <TooltipComponent {...props} onOpenChange={onOpenChange}>
      <TooltipInteractiveWrapper>
        <Badge>NEW</Badge>
      </TooltipInteractiveWrapper>
    </TooltipComponent>
  );
};
TestTooltipInteractiveWrapper.args = {
  content: 'Hello World',
};
TestTooltipInteractiveWrapper.play = async () => {
  const { getByText, queryByText } = within(document.body);
  const tooltipContent = 'Hello World';
  await expect(queryByText(tooltipContent)).not.toBeInTheDocument();
  const badge = getByText('NEW');
  // open
  await userEvent.hover(badge);
  await sleep(600);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText(tooltipContent)).toBeVisible();
  // close
  await userEvent.unhover(badge);
  await sleep(600);
  await expect(onOpenChange).toBeCalledWith({ isOpen: false });
  await expect(queryByText(tooltipContent)).not.toBeInTheDocument();
};

const CustomTrigger = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & BladeCommonEvents
>(
  (
    {
      children,
      onBlur,
      onFocus,
      onMouseLeave,
      onMouseMove,
      onPointerDown,
      onPointerEnter,
      onTouchEnd,
      onTouchStart,
    },
    ref,
  ) => {
    return (
      <BaseBox
        width="80px"
        height="80px"
        backgroundColor="surface.background.level2.lowContrast"
        textAlign="center"
        ref={ref}
        tabIndex={0}
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchStart}
      >
        <Text contrast="low">{children}</Text>
      </BaseBox>
    );
  },
);

// custom trigger
export const TestCustomTrigger: StoryFn<typeof TooltipComponent> = (props): React.ReactElement => {
  onOpenChange.mockReset();
  return (
    <TooltipComponent {...props} onOpenChange={onOpenChange}>
      <CustomTrigger>Custom Trigger</CustomTrigger>
    </TooltipComponent>
  );
};
TestCustomTrigger.args = {
  content: 'Hello World',
};
TestCustomTrigger.play = async () => {
  const { getByText, queryByText } = within(document.body);
  const tooltipContent = 'Hello World';
  await expect(queryByText(tooltipContent)).not.toBeInTheDocument();
  const trigger = getByText('Custom Trigger');
  // open
  await userEvent.hover(trigger);
  await sleep(600);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText(tooltipContent)).toBeVisible();
  // close
  await userEvent.unhover(trigger);
  await sleep(600);
  await expect(onOpenChange).toBeCalledWith({ isOpen: false });
  await expect(queryByText(tooltipContent)).not.toBeInTheDocument();
};

// should open/close immediately on focus/blur without the default delay of 300ms
export const TestTooltipOpenCloseFocus: StoryFn<typeof TooltipComponent> = (
  props,
): React.ReactElement => {
  return (
    <TooltipComponent {...props} onOpenChange={onOpenChange}>
      <Button>Hover me</Button>
    </TooltipComponent>
  );
};

TestTooltipOpenCloseFocus.args = {
  content: 'Some text',
};
TestTooltipOpenCloseFocus.play = async () => {
  const { queryByText } = within(document.body);
  const tooltipContent = 'Some text';
  await expect(queryByText(tooltipContent)).not.toBeInTheDocument();
  // open
  await userEvent.keyboard('{Tab}', {});
  await sleep(600);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText(tooltipContent)).toBeVisible();
  // close
  await userEvent.keyboard('{Tab}', {});
  await sleep(600);
  await expect(onOpenChange).toBeCalledWith({ isOpen: false });
  await expect(queryByText(tooltipContent)).not.toBeInTheDocument();
};

export default {
  title: 'Components/Interaction Tests/Tooltip',
  component: TooltipComponent,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};
