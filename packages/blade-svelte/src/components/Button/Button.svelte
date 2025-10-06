<script lang="ts">
  import './button.css'
  
  // Define prop types
  interface Props {
    children?: any;
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'small' | 'medium' | 'large'
    disabled?: boolean
  }
  
  // Define props with defaults using Svelte 5 syntax
  let { 
    children = '', 
    variant = 'primary', 
    size = 'medium', 
    disabled = false 
  }: Props = $props()
  
  // Handle click events
  function handleClick(event: MouseEvent): void {
    if (!disabled) {
      // Dispatch click event to parent
      const clickEvent = new CustomEvent('click', {
        detail: { event }
      })
      dispatchEvent(clickEvent)
    }
  }
</script>

<button
  class="btn btn--{variant} btn--{size}"
  class:disabled
  on:click={handleClick}
  {disabled}
>
  <slot>{children}</slot>
</button>
