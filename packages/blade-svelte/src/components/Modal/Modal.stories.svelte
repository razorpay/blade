<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Modal from './Modal.svelte';
  import type { ModalProps } from './types';

  /* Storybook title MUST match the React export verbatim:
   *   blade/src/components/Modal/docs/SimpleModal.stories.tsx → 'Components/Modal/SimpleModal'. */
  const { Story } = defineMeta({
    title: 'Components/Modal/SimpleModal',
    component: Modal,
    tags: ['autodocs'],
    args: {
      size: 'medium',
      isDismissible: true,
    },
    argTypes: {
      isOpen: { table: { disable: true } },
      children: { table: { disable: true } },
      onDismiss: { table: { disable: true } },
      initialFocusRef: { table: { disable: true } },
      isDismissible: { control: 'boolean' },
      zIndex: { control: 'number' },
      size: {
        control: 'select',
        options: ['small', 'medium', 'large', 'full'],
      },
    },
  } as Parameters<typeof defineMeta>[0] & { argTypes: Record<string, unknown> });
</script>

<script lang="ts">
  import ModalHeader from './ModalHeader.svelte';
  import ModalBody from './ModalBody.svelte';
  import ModalFooter from './ModalFooter.svelte';
  import Button from '../Button/Button.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Alert from '../Alert/Alert.svelte';
  import RadioGroup from '../Radio/RadioGroup.svelte';
  import Radio from '../Radio/Radio.svelte';
  import Skeleton from '../Skeleton/Skeleton.svelte';

  let isPlaygroundOpen = $state(false);
  let isSimpleOpen = $state(false);
  let isNonDismissibleOpen = $state(false);
  let isFullPageOpen = $state(false);
  let isImageLoading = $state(true);
</script>

<!-- Playground — controls drive size + isDismissible. -->
<Story name="Playground">
  {#snippet template(args: ModalProps)}
    <div>
      <Button onClick={() => (isPlaygroundOpen = true)}>Open Modal</Button>
      <Modal
        {...args}
        isOpen={isPlaygroundOpen}
        onDismiss={() => (isPlaygroundOpen = false)}
      >
        {#snippet children()}
          <ModalHeader
            title="Address Details"
            subtitle="Use the controls to tweak size and isDismissible"
          />
          <ModalBody>
            {#snippet children()}
              <Text>Modal body content goes here.</Text>
            {/snippet}
          </ModalBody>
          <ModalFooter>
            {#snippet children()}
              <div style="display: flex; gap: var(--spacing-3); justify-content: flex-end; width: 100%;">
                <Button variant="secondary" onClick={() => (isPlaygroundOpen = false)}>Cancel</Button>
                <Button onClick={() => (isPlaygroundOpen = false)}>Confirm</Button>
              </div>
            {/snippet}
          </ModalFooter>
        {/snippet}
      </Modal>
    </div>
  {/snippet}
</Story>

<!-- Story 1: Simple Modal. -->
<Story name="Simple Modal">
  {#snippet template(args: ModalProps)}
    <div>
      <Button onClick={() => (isSimpleOpen = true)}>Open Modal</Button>
      <Modal
        isOpen={isSimpleOpen}
        onDismiss={() => (isSimpleOpen = false)}
        size={args.size}
      >
        {#snippet children()}
          <ModalHeader
            title="Address Details"
            subtitle="This example is created for Modal snapshot testing"
          />
          <ModalBody>
            {#snippet children()}
              <RadioGroup label="Addresses">
                <Radio value="home">Home - 11850 Florida 24, Cedar Key, Florida</Radio>
                <Radio value="office-1">Office - 2033 Florida 21, Cedar Key, Florida</Radio>
                <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
              </RadioGroup>
            {/snippet}
          </ModalBody>
          <ModalFooter>
            {#snippet children()}
              <div style="display: flex; gap: var(--spacing-3); justify-content: flex-end; width: 100%;">
                <Button variant="secondary">Remove address</Button>
                <Button>Add address</Button>
              </div>
            {/snippet}
          </ModalFooter>
        {/snippet}
      </Modal>
    </div>
  {/snippet}
</Story>

<!-- Story 2: Non-Dismissible Modal. -->
<Story name="Non-Dismissible Modal">
  {#snippet template(args: ModalProps)}
    <div>
      <Button onClick={() => (isNonDismissibleOpen = true)}>Open Non-Dismissible Modal</Button>
      <Modal isOpen={isNonDismissibleOpen} isDismissible={false} size={args.size}>
        {#snippet children()}
          <ModalHeader
            title="Important Action Required"
            subtitle="This modal requires explicit confirmation"
          />
          <ModalBody>
            {#snippet children()}
              <Alert
                title="Notice"
                description="This modal cannot be dismissed by clicking outside or pressing escape key."
                color="notice"
                isDismissible={false}
                isFullWidth
              />
              <Text marginTop="spacing.4" color="surface.text.gray.subtle">
                Try clicking outside the modal or pressing the escape key - it won't close. You must
                click one of the buttons below to proceed.
              </Text>
            {/snippet}
          </ModalBody>
          <ModalFooter>
            {#snippet children()}
              <div style="display: flex; gap: var(--spacing-3); justify-content: flex-end; width: 100%;">
                <Button variant="secondary" onClick={() => (isNonDismissibleOpen = false)}>Cancel</Button>
                <Button onClick={() => (isNonDismissibleOpen = false)}>Confirm Action</Button>
              </div>
            {/snippet}
          </ModalFooter>
        {/snippet}
      </Modal>
    </div>
  {/snippet}
</Story>

<!-- Story 3: Full Page Modal. -->
<Story name="Full Page Modal" args={{ size: 'full' }}>
  {#snippet template()}
    <div>
      <Button onClick={() => (isFullPageOpen = true)}>Open Modal</Button>
      <Modal isOpen={isFullPageOpen} onDismiss={() => (isFullPageOpen = false)} size="full">
        {#snippet children()}
          <ModalHeader
            title="Full Page Modal"
            subtitle="This example is created for Full Page Modal"
          />
          <ModalBody height="100%" padding="spacing.0">
            {#snippet children()}
              <div style="position: relative; width: 100%; height: 100%;">
                {#if isImageLoading}
                  <div
                    style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: var(--surface-background-gray-intense);"
                  >
                    <Skeleton height="100%" width="100%" />
                  </div>
                {/if}
                <img
                  width="100%"
                  height="100%"
                  src="https://picsum.photos/1920/1080"
                  alt="random"
                  onload={() => (isImageLoading = false)}
                  style={`display: ${isImageLoading ? 'none' : 'block'}`}
                />
              </div>
            {/snippet}
          </ModalBody>
          <ModalFooter>
            {#snippet children()}
              <div style="display: flex; gap: var(--spacing-3); justify-content: flex-end; width: 100%;">
                <Button isDisabled={isImageLoading}>Download</Button>
              </div>
            {/snippet}
          </ModalFooter>
        {/snippet}
      </Modal>
    </div>
  {/snippet}
</Story>
