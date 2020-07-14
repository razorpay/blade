import React from 'react';

export default (children) => {
  const childrenGroupByType = {};
  React.Children.forEach(children, (child) => {
    if (child) {
      childrenGroupByType[child.type] = childrenGroupByType[child.type] || [];
      childrenGroupByType[child.type].push(child);
    }
  });
  return childrenGroupByType;
};
