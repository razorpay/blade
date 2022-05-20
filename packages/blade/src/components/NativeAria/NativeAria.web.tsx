import React from 'react';
import mapA11yProps from '../../utils/mapProps';
import { CloseIcon, EyeIcon } from '../Icons';

const Checkbox: React.FC<{ label: string; checked?: boolean; disabled?: boolean }> = ({
  label,
  checked,
  disabled,
}) => {
  const [isChecked, setChecked] = React.useState(checked);

  const toggleChecked = (): void => {
    if (disabled) return;
    setChecked((prev) => !prev);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent): void => {
    if (disabled) return;
    switch (event.key) {
      case ' ':
        toggleChecked();
        break;
      default:
        break;
    }
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
      <span
        onKeyDown={handleOnKeyDown}
        onClick={toggleChecked}
        {...mapA11yProps({
          accessibilityRole: 'checkbox',
          accessibilityDisabled: disabled,
          accessibilityChecked: isChecked ? 'true' : 'false',
        })}
        tabIndex={0}
      >
        {label}
      </span>
    </>
  );
};

const NativeAria = (): React.ReactElement => {
  return (
    <>
      <h3 id="id-group-label">Fruites</h3>
      <div
        {...mapA11yProps({
          accessibilityRole: 'group',
          accessibilityLabelledBy: 'id-group-label',
        })}
      >
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
