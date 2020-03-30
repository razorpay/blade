import React from 'react';

const SegmentControlContext = React.createContext(null);

export const useSegmentControlContext = () => {
  const segmentControlContext = React.useContext(SegmentControlContext);
  if (segmentControlContext === undefined) {
    throw new Error('useSegmentControlContext must be used within a SegmentControlProvider');
  }
  return segmentControlContext;
};

export default SegmentControlContext;
