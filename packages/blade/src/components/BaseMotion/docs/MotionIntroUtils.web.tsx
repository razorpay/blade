import React from 'react';
import { Box } from '~components/Box';
import { Move } from '~components/Move';
import { Display } from '~components/Typography';

export const HeadingTitle = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 5000);
  }, []);

  return (
    <Move isVisible={isVisible}>
      <Box>
        <Display>Introduction to Motion Presets at {isVisible ? 'visible' : 'not visible'}</Display>
      </Box>
    </Move>
  );
};
