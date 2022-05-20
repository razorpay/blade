import React from 'react';
import mapA11yProps from '../../utils/mapProps';
import { CloseIcon, EyeIcon } from '../Icons';

const Checkbox: React.FC<{ label: string; checked?: boolean }> = ({ label, checked }) => {
  const [isChecked, setChecked] = React.useState(checked);

  const handleOnKeyDown = (event: React.KeyboardEvent): void => {
    switch (event.key) {
      case ' ':
        setChecked((prev) => !prev);
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
        onClick={(): void => setChecked((prev) => !prev)}
        {...mapA11yProps({
          accessibilityRole: 'checkbox',
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
            <Checkbox label="Apple" />
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
