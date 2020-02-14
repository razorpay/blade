import React from 'react';
import Svg, { Mask, G, Path, Defs, ClipPath } from 'react-native-svg';

function Info(props) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="#162F56" {...props}>
      <Mask id="prefix__a" maskUnits="userSpaceOnUse" x={1} y={1} width={14} height={14}>
        <G clipPath="url(#prefix__clip0)" fill="#fff">
          <Path d="M7.995 7.44c.307 0 .555.248.555.555v2.222a.555.555 0 11-1.11 0V7.995c0-.307.248-.555.555-.555zM7.995 5.218a.555.555 0 100 1.11h.006a.555.555 0 100-1.11h-.006z" />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.885 7.995a6.11 6.11 0 1112.22 0 6.11 6.11 0 01-12.22 0zm6.11-4.999a4.999 4.999 0 100 9.998 4.999 4.999 0 000-9.998z"
          />
        </G>
      </Mask>
      <G mask="url(#prefix__a)">
        <Path d="M0 0h16v16H0z" />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path d="M1.33 1.33h13.33v13.33H1.33V1.33z" fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default Info;
