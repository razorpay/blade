import * as React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Refund({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M6.509 3.134a.952.952 0 10-1.88-.31l-.464 2.82a.952.952 0 00.785 1.094l2.819.464a.952.952 0 10.31-1.88l-.856-.14a8.095 8.095 0 115.202 14.87 8.099 8.099 0 01-8.206-4.698.952.952 0 10-1.733.789c1.73 3.803 5.747 6.258 10.135 5.803 5.493-.57 9.484-5.485 8.914-10.978-.57-5.493-5.485-9.484-10.978-8.914a9.964 9.964 0 00-4.094 1.358l.046-.278z"
        fill={fill}
      />
      <path
        d="M7.475 8.799c0-.442.38-.8.847-.8h5.925c.468 0 .847.358.847.8 0 .441-.38.8-.847.8h-.373c.14.247.244.516.307.799h.066c.468 0 .847.358.847.8 0 .441-.38.8-.847.8h-.066c-.302 1.369-1.586 2.398-3.126 2.398h-.412l3.384 2.665a.77.77 0 01.109 1.126.881.881 0 01-1.192.102l-5.08-3.998a.827.827 0 01-.098-.091.78.78 0 01-.29-.603c0-.442.378-.8.846-.8h2.733c.594 0 1.108-.326 1.35-.8H9.168c-.467 0-.846-.358-.846-.8 0-.441.379-.799.846-.799h3.237a1.509 1.509 0 00-1.35-.8H8.322c-.468 0-.847-.358-.847-.8z"
        fill={fill}
      />
    </svg>
  );
}

Refund.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Refund.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Refund;
