import type { IconComponent } from '~components/Icons';
import useIconProps from '~components/Icons/useIconProps';
import Svg, { Path } from '~components/Icons/_Svg';

// Simplified for RN: removed SVG filters and gradients (not fully supported in react-native-svg)
// Uses flat colors approximating the gradient stops
const TrustedBadgeIcon: IconComponent = (props) => {
  const { width, height } = useIconProps(props);
  return (
    <Svg display="block" width={width} height={height} viewBox="0 0 19 20" fill="none">
      {/* Outer shield */}
      <Path
        d="M18.1763 3.12496C14.4216 3.12496 11.5452 2.14992 9.11271 0C6.68058 2.14992 3.80428 3.12496 0.0498704 3.12496C0.0498704 8.72327 -1.22466 16.7433 9.11271 20C19.4508 16.7432 18.1763 8.72327 18.1763 3.12496Z"
        fill="#80F399"
      />
      {/* Inner shield */}
      <Path
        d="M16.9345 4.04107C13.6801 4.04107 11.1869 3.19596 9.07861 1.33252C6.97056 3.19596 4.47753 4.04107 1.2234 4.04107C1.2234 8.8934 0.118706 15.8448 9.07861 18.6675C18.0391 15.8447 16.9345 8.8934 16.9345 4.04107Z"
        fill="#2EAE52"
      />
      {/* Lightning bolt */}
      <Path
        d="M8.17223 7.68163L7.72705 9.30015L10.2744 7.67253L8.60851 13.8131L10.3002 13.8147L12.7611 4.74487L8.17223 7.68163Z"
        fill="white"
      />
      <Path
        d="M5.42984 11.2342L4.72949 13.8156H8.19707C8.19707 13.8156 9.61539 8.5655 9.61579 8.56396C9.61446 8.5648 5.42984 11.2342 5.42984 11.2342Z"
        fill="white"
      />
    </Svg>
  );
};

export { TrustedBadgeIcon };
