import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Subscription(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="M14.217 2.317a8 8 0 00-9.764 5.017 1 1 0 01-1.886-.668 10 10 0 0116.489-3.744L22 5.688V4a1 1 0 112 0v4a.997.997 0 01-1 1h-4a1 1 0 110-2h1.476l-2.8-2.631a8 8 0 00-3.458-2.051zM.282 15.304A.996.996 0 011 15h4a1 1 0 110 2H3.525l2.8 2.631.022.022a8 8 0 0013.2-2.987 1 1 0 111.886.668 10 10 0 01-16.489 3.744L2 18.312V20a1 1 0 11-2 0v-4a1.012 1.012 0 01.072-.373.994.994 0 01.21-.323z" />
      <path d="M8.5 6a1 1 0 000 2h3.23a1.77 1.77 0 011.594 1H9.5a1 1 0 000 2h3.824a1.77 1.77 0 01-1.595 1H8.5a1 1 0 00-.656 1.755c.035.04.073.078.116.113l6 5a1 1 0 101.28-1.536L11.242 14h.487a3.772 3.772 0 003.692-3h.079a1 1 0 100-2h-.079a3.744 3.744 0 00-.362-1h.441a1 1 0 100-2h-7z" />
    </Icon>
  );
}

Subscription.propTypes = IconPropTypes;

Subscription.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default Subscription;
