import { useId } from 'react';
import { Svg } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

/**
 * RazorpayTrustIcon renders the branded "Razorpay Trusted Business" shield.
 *
 * Unlike standard Blade icons it keeps its brand gradients and drop-shadow, so the
 * `color` prop is intentionally ignored. It is web-only because the Blade `_Svg`
 * primitives do not support gradients/filters on React Native.
 */
const _RazorpayTrustIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width } = useIconProps({ size, color });

  // Unique per-instance ids prevent gradient/filter collisions when multiple instances
  // render on the same page (SVG `id`s are document-global).
  const uid = useId();
  const fillId = `razorpayTrustFill-${uid}`;
  const strokeId = `razorpayTrustStroke-${uid}`;
  const shadowId = `razorpayTrustShadow-${uid}`;

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M19.7981 3.96094V15.3838C19.798 16.163 19.4121 16.8915 18.7679 17.3301L12.1311 21.8467L5.49443 17.3301C4.85022 16.8915 4.46425 16.163 4.46415 15.3838V3.96094L12.1311 2.09277L19.7981 3.96094Z"
        fill={`url(#${fillId})`}
        stroke={`url(#${strokeId})`}
        strokeWidth="0.666667"
      />
      <g filter={`url(#${shadowId})`}>
        <path
          d="M11.5244 8.82L11.0532 10.6936L13.7494 8.80947L11.9861 15.9179L13.7767 15.9196L16.3815 5.42041L11.5244 8.82Z"
          fill="white"
        />
        <path
          d="M8.62275 12.9321L7.88147 15.9204H11.5517L13.0534 9.8411L8.62275 12.9321Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id={shadowId}
          x="5.65925"
          y="3.19819"
          width="12.9444"
          height="14.9444"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.11111" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0.294097 0 0 0 0 0.152931 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <linearGradient
          id={fillId}
          x1="4.13115"
          y1="5.0249"
          x2="18.2093"
          y2="18.4295"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00FD0A" />
          <stop offset="0.972213" stopColor="#00AD8E" />
        </linearGradient>
        <linearGradient
          id={strokeId}
          x1="6.35337"
          y1="4.55055"
          x2="17.5246"
          y2="17.4954"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#65FF4D" />
          <stop offset="0.302473" stopColor="white" stopOpacity="0.895" />
          <stop offset="0.452125" stopColor="#65FF4D" stopOpacity="0.805" />
          <stop offset="1" stopColor="#00C67F" />
        </linearGradient>
      </defs>
    </Svg>
  );
};

const RazorpayTrustIcon = assignWithoutSideEffects(_RazorpayTrustIcon, {
  componentId: 'RazorpayTrustIcon',
});

export default RazorpayTrustIcon;
