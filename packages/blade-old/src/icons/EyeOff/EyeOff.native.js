import * as React from 'react';
import { Path, Defs, ClipPath, G } from 'react-native-svg';
import { useTheme } from 'styled-components/native';
import Icon, { IconPropTypes } from '../../atoms/Icon';
import { getColor } from '../../_helpers/theme';

function Eye(props) {
  const theme = useTheme();

  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <G clipPath="url(#clip0)" fill={getColor(theme, props.fill)}>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.707.293A1 1 0 00.293 1.707l4.256 4.256C2.118 8.236.61 10.547.106 11.558a1 1 0 00.01.915c.796 1.503 2.316 3.704 4.333 5.493 2 1.773 4.623 3.256 7.597 3.038a11.07 11.07 0 005.783-1.76l4.464 4.463a1 1 0 001.414-1.414l-22-22zm14.668 17.496l-2.322-2.322a4 4 0 01-5.515-5.515L5.964 7.378c-1.942 1.805-3.231 3.624-3.822 4.624.757 1.303 2.027 3.042 3.634 4.467 1.818 1.612 3.934 2.71 6.147 2.539a9.072 9.072 0 004.451-1.22zm-6.346-6.346a2 2 0 002.533 2.533l-2.533-2.533zm13.849.083c-.797-1.46-2.317-3.605-4.33-5.374-2-1.757-4.61-3.25-7.565-3.147-.778 0-1.553.089-2.31.266a1 1 0 00.455 1.948 8.12 8.12 0 011.909-.215c2.236-.082 4.37 1.05 6.19 2.65 1.59 1.398 2.85 3.072 3.608 4.332-.23.364-.517.802-.8 1.22-.215.318-.423.616-.6.856a5.14 5.14 0 01-.342.436 1 1 0 001.414 1.414c.162-.162.36-.42.542-.667a44.54 44.54 0 001.809-2.725 1 1 0 00.02-.994z"
        />
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Path d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Icon>
  );
}

Eye.propTypes = IconPropTypes;

Eye.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default Eye;
