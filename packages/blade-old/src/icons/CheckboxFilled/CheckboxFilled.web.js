import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

export default function CheckboxFilled(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 8C6 6.89543 6.89543 6 8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8ZM14.6416 10.9038C14.8646 10.6876 14.8701 10.3314 14.6538 10.1084C14.4376 9.8854 14.0814 9.87992 13.8584 10.0962L11.1563 12.7165L10.1416 11.7325C9.91856 11.5163 9.56245 11.5218 9.34618 11.7448C9.12992 11.9678 9.1354 12.3239 9.35842 12.5402L10.7647 13.9038C10.9829 14.1154 11.3296 14.1154 11.5478 13.9038L14.6416 10.9038Z"
      />
    </Icon>
  );
}

CheckboxFilled.propTypes = IconPropTypes;

CheckboxFilled.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};
