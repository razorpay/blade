/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from 'react';

function PickerEffects({ height }) {
  return (
    <>
      <div className="react-ios-time-picker-top-shadow" style={{ height: `${height * 2}px` }} />
      <div className="react-ios-time-picker-bottom-shadow" style={{ height: `${height * 2}px` }} />
    </>
  );
}

export default PickerEffects;
