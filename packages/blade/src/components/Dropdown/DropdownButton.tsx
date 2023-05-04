import { useDropdown } from './useDropdown';
import type { ButtonProps } from '~components/Button';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import BaseButton from '~components/Button/BaseButton';
import { makeAccessible } from '~utils';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';

const _DropdownButton = (props: ButtonProps): JSX.Element => {
  const {
    onTriggerClick,
    onTriggerBlur,
    onTriggerKeydown,
    dropdownBaseId,
    isOpen,
    activeIndex,
    hasFooterAction,
    triggererRef,
  } = useDropdown();
  return (
    <BaseButton
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={triggererRef as any}
      {...props}
      {...makeAccessible({
        hasPopup: getActionListContainerRole(hasFooterAction, 'DropdownButton'),
        expanded: isOpen,
        controls: `${dropdownBaseId}-actionlist`,
        role: 'combobox',
        activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
      })}
      onClick={onTriggerClick}
      onBlur={() => {
        // With button trigger, there is no "value" as such. It's just clickable items
        onTriggerBlur?.({ name: '', value: '' });
      }}
      onKeyDown={(e) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-explicit-any
        onTriggerKeydown?.({ event: e as any });
      }}
    />
  );
};

const DropdownButton = assignWithoutSideEffects(_DropdownButton, { componentId: 'DropdownButton' });

export { DropdownButton };
