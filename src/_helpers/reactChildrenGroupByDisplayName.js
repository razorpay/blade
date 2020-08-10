import React from 'react';

export default (children) => {
  const childrenGroupByDisplayName = {};
  React.Children.forEach(children, (child) => {
    if (child) {
      if (child.type.displayName) {
        childrenGroupByDisplayName[child.type.displayName] =
          childrenGroupByDisplayName[child.type.displayName] || [];
        childrenGroupByDisplayName[child.type.displayName].push(child);
      }
    }
  });
  return childrenGroupByDisplayName;
};
