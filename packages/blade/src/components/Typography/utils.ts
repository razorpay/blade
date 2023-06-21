import React from 'react';

const useValidateAsProp = ({
  as,
  componentName,
  validAsValues,
}: {
  as?: string;
  componentName: string;
  validAsValues: readonly string[];
}): void => {
  React.useEffect(() => {
    if (as && !validAsValues.includes(as)) {
      throw new Error(
        `[Blade ${componentName}]: Invalid \`as\` prop value - ${as}. Only ${validAsValues.join(
          ', ',
        )} are accepted`,
      );
    }
  }, [as, componentName, validAsValues]);
};

export { useValidateAsProp };
