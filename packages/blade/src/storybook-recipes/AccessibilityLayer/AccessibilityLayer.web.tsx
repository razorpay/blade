import React from 'react';
import makeAccessible from '../../utils/makeAccessible';
import { CloseIcon, EyeIcon } from '../../components/Icons';
import { getCheckboxA11yProps } from './getCheckboxA11yProps';

const Checkbox: React.FC<{ label: string; checked?: boolean; disabled?: boolean }> = ({
  label,
  checked,
  disabled,
}) => {
  const [isChecked, setChecked] = React.useState(checked);
  const checkboxA11yProps = getCheckboxA11yProps({ isDisabled: disabled, isChecked });

  const toggleChecked = (): void => {
    if (disabled) return;
    setChecked((prev) => !prev);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === ' ') toggleChecked();
  };

  return (
    <>
      <span>
        {isChecked ? (
          <EyeIcon color="action.icon.link.active" size="small" />
        ) : (
          <CloseIcon color="action.icon.link.active" size="small" />
        )}
      </span>
      <span onKeyDown={handleOnKeyDown} onClick={toggleChecked} {...checkboxA11yProps} tabIndex={0}>
        {label}
      </span>
    </>
  );
};

const NativeAria = (): React.ReactElement => {
  const checkboxGroupA11y = makeAccessible({
    accessibilityRole: 'group',
    accessibilityLabelledBy: 'id-group-label',
  });

  return (
    <>
      <h3 id="id-group-label">Fruits</h3>
      <div {...checkboxGroupA11y}>
        <ul>
          <li>
            <Checkbox checked label="Mango" />
          </li>
          <li>
            <Checkbox disabled label="Apple" />
          </li>
          <li>
            <Checkbox label="Banana" />
          </li>
        </ul>
      </div>
    </>
  );
};

export default NativeAria;
