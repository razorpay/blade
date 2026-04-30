<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Switch from './Switch.svelte';

  const { Story } = defineMeta({
    title: 'Components/Switch',
    component: Switch,
    tags: ['autodocs'],
    args: {
      defaultChecked: undefined,
      isChecked: undefined,
      isDisabled: undefined,
      name: undefined,
      onChange: undefined,
      value: undefined,
      size: 'medium',
      accessibilityLabel: 'Toggle DarkMode',
    },
    argTypes: {
      isChecked: {
        control: { type: 'boolean' },
        description: 'Controls the checked state of the switch (controlled).',
        table: { type: { summary: 'boolean' } },
      },
      defaultChecked: {
        control: { type: 'boolean' },
        description: 'The initial checked state of the switch (uncontrolled).',
        table: { type: { summary: 'boolean' } },
      },
      isDisabled: {
        control: { type: 'boolean' },
        description: 'Disables the switch.',
        table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
      },
      size: {
        control: { type: 'select' },
        options: ['small', 'medium'],
        description: 'Sets the size of the switch.',
        table: { type: { summary: '"small" | "medium"' }, defaultValue: { summary: 'medium' } },
      },
      name: {
        control: { type: 'text' },
        description: 'Name attribute for the underlying input.',
        table: { type: { summary: 'string' } },
      },
      value: {
        control: { type: 'text' },
        description: 'Value attribute for the underlying input.',
        table: { type: { summary: 'string' } },
      },
      accessibilityLabel: {
        control: { type: 'text' },
        description: 'Accessible label exposed to screen readers.',
        table: { type: { summary: 'string' } },
      },
      testID: {
        control: { type: 'text' },
        description: 'Test ID for the outer wrapper.',
        table: { type: { summary: 'string' } },
      },
    },
  });
</script>

<script lang="ts">
  import Button from '../Button/Button.svelte';
  import Link from '../Link/Link.svelte';
  import type { SwitchInstance } from './types';

  let controlledChecked = $state(false);
  let switchInstance: SwitchInstance | undefined = $state();

  function focusSwitch(): void {
    switchInstance?.focus();
  }

  const showcaseSizes = ['medium', 'small'] as const;
  const showcaseCheckedStates = [false, true] as const;
  const showcaseStates = [
    { label: 'Default', isDisabled: false },
    { label: 'Disabled', isDisabled: true },
  ] as const;

  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
</script>

<!-- 1. Default — args-only playground -->
<Story name="Default" />

<!-- 2. Checked — pre-checked controlled switch -->
<Story name="Checked" args={{ isChecked: true }} />

<!-- 3. DefaultChecked — pre-checked uncontrolled switch -->
<Story name="DefaultChecked" args={{ defaultChecked: true }} />

<!-- 4. Small Size — small variant -->
<Story name="Small Size" args={{ size: 'small' }} />

<!-- 5. WithLabel — multiple labelling patterns + grouped rows -->
<Story name="WithLabel" asChild>
  <div>
    <div
      role="note"
      style="
        display: block;
        margin-bottom: var(--spacing-6);
        padding: var(--spacing-4);
        border: 1px solid var(--feedback-border-notice-subtle);
        border-radius: var(--border-radius-medium);
        background-color: var(--feedback-background-notice-subtle);
        color: var(--feedback-text-notice-intense);
      "
    >
      <strong style="display: block; margin-bottom: var(--spacing-2);">Note</strong>
      <span>
        Switch doesn't come with a label out of the box, consumers can create custom label if
        needed, see the switch
        <Link
          variant="anchor"
          href="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=31919-629519&t=9TijeCLrhExSrH1z-0"
        >
          guidelines for more details
        </Link>
        on how to use labels.
      </span>
    </div>

    <p style="margin: 0 0 var(--spacing-3) 0; font-family: var(--font-family-text);">
      Right position:
    </p>
    <label style="display: flex; align-items: center; gap: var(--spacing-2);">
      <Switch accessibilityLabel="Toggle Darkmode" size="small" />
      <span style="font-family: var(--font-family-text);">Toggle Darkmode</span>
    </label>

    <p style="margin: var(--spacing-7) 0 var(--spacing-3) 0; font-family: var(--font-family-text);">
      Left position:
    </p>
    <label style="display: flex; align-items: center; gap: var(--spacing-2);">
      <span style="font-family: var(--font-family-text);">Toggle Darkmode</span>
      <Switch accessibilityLabel="Toggle Darkmode" size="small" />
    </label>

    <p style="margin: var(--spacing-7) 0 var(--spacing-3) 0; font-family: var(--font-family-text);">
      Multiple Groups:
    </p>
    <div style="width: 350px;">
      <div
        style="
          padding: var(--spacing-5);
          border: 1px solid var(--surface-border-gray-muted);
          border-radius: var(--border-radius-medium);
          background-color: var(--surface-background-gray-intense);
        "
      >
        <p
          style="
            margin: 0 0 var(--spacing-4) 0;
            font-family: var(--font-family-text);
            font-weight: var(--font-weight-semibold);
            font-size: var(--font-size-75);
          "
        >
          Activate/lock the below methods for card transactions
        </p>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-3);">
          <label
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: var(--spacing-2);
            "
          >
            <span style="display: flex; align-items: center; gap: var(--spacing-2);">
              <span aria-hidden="true" style="display: inline-flex; width: 16px; height: 16px;">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 1.333A4.667 4.667 0 0 0 3.333 6c0 3.5 4.667 8.667 4.667 8.667S12.667 9.5 12.667 6A4.667 4.667 0 0 0 8 1.333zm0 6.334A1.667 1.667 0 1 1 8 4.333a1.667 1.667 0 0 1 0 3.334z"
                    fill="var(--surface-icon-gray-subtle)"
                  />
                </svg>
              </span>
              <span style="font-family: var(--font-family-text);">International transaction</span>
            </span>
            <Switch accessibilityLabel="International transaction" size="small" />
          </label>

          <label
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: var(--spacing-2);
            "
          >
            <span style="display: flex; align-items: center; gap: var(--spacing-2);">
              <span aria-hidden="true" style="display: inline-flex; width: 16px; height: 16px;">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="6" stroke="var(--surface-icon-gray-muted)" stroke-width="1.5" />
                  <path
                    d="M2 8h12M8 2c2 1.6 3 3.8 3 6s-1 4.4-3 6c-2-1.6-3-3.8-3-6s1-4.4 3-6z"
                    stroke="var(--surface-icon-gray-muted)"
                    stroke-width="1.5"
                  />
                </svg>
              </span>
              <span style="font-family: var(--font-family-text);">Online transaction</span>
            </span>
            <Switch accessibilityLabel="Online transaction" size="small" />
          </label>

          <label
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: var(--spacing-2);
            "
          >
            <span style="display: flex; align-items: center; gap: var(--spacing-2);">
              <span aria-hidden="true" style="display: inline-flex; width: 16px; height: 16px;">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 6c3.3-3 8.7-3 12 0M4 9c2-2 6-2 8 0M8 12.5h.01"
                    stroke="var(--surface-icon-gray-muted)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
              <span style="font-family: var(--font-family-text);">Contactless Transaction</span>
            </span>
            <Switch accessibilityLabel="Contactless Transaction" size="small" />
          </label>
        </div>
      </div>
    </div>
  </div>
</Story>

<!-- 6. ControlledAndUncontrolled — side-by-side patterns -->
<Story name="ControlledAndUncontrolled" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-3);">
    <label style="display: flex; align-items: center; gap: var(--spacing-2);">
      <Switch
        accessibilityLabel="Toggle darkmode"
        defaultChecked
        onChange={(e) => console.log(e)}
      />
      <span style="font-family: var(--font-family-text);">Uncontrolled</span>
    </label>

    <label style="display: flex; align-items: center; gap: var(--spacing-2);">
      <Switch
        accessibilityLabel="Toggle darkmode"
        isChecked={controlledChecked}
        onChange={(e) => (controlledChecked = e.isChecked)}
      />
      <span style="font-family: var(--font-family-text);">
        Controlled - Checked: {controlledChecked ? 'True' : 'False'}
      </span>
    </label>
  </div>
</Story>

<!-- 7. Switch Ref — bind:this + focus() method -->
<Story name="Switch Ref" asChild>
  <div style="display: flex; gap: var(--spacing-3); align-items: center;">
    <Switch bind:this={switchInstance} accessibilityLabel="Toggle darkmode" />
    <Button onClick={focusSwitch}>Click to focus the switch</Button>
  </div>
</Story>

<!-- 8. Showcase — full size × checked × disabled matrix -->
<Story name="Showcase" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-11);">
    {#each showcaseSizes as size}
      <div style="display: flex; flex-direction: column; gap: var(--spacing-7);">
        <strong
          style="
            font-family: var(--font-family-text);
            font-size: var(--font-size-200);
            font-weight: var(--font-weight-semibold);
          "
        >
          Size: {capitalize(size)}
        </strong>

        <div style="display: flex; flex-direction: row; gap: var(--spacing-11);">
          {#each showcaseCheckedStates as isChecked}
            <div style="display: flex; flex-direction: column; gap: var(--spacing-7);">
              <strong
                style="
                  font-family: var(--font-family-text);
                  font-size: var(--font-size-100);
                  font-weight: var(--font-weight-semibold);
                  color: var(--surface-text-gray-subtle);
                "
              >
                isChecked: {String(isChecked)}
              </strong>

              <div style="display: flex; flex-direction: column; gap: var(--spacing-7);">
                {#each showcaseStates as state}
                  <div
                    style="
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      gap: var(--spacing-5);
                    "
                  >
                    <div style="width: 80px;">
                      <span
                        style="
                          font-family: var(--font-family-text);
                          font-size: var(--font-size-75);
                          color: var(--surface-text-gray-muted);
                        "
                      >
                        {state.label}
                      </span>
                    </div>
                    <Switch
                      {size}
                      {isChecked}
                      isDisabled={state.isDisabled}
                      accessibilityLabel={`Switch ${size} ${
                        isChecked ? 'checked' : 'unchecked'
                      } ${state.isDisabled ? 'disabled' : 'default'}`}
                      onChange={() => console.log('onChange')}
                    />
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</Story>
