/**
 * Thumbs-up over a beaming face.
 *
 * Web only: the motion is CSS driven by the mood button's own hover, focus and selected states,
 * which styled-components/native cannot express.
 *
 * The button owns the hover target, not this glyph. A 20px face inside a 32px control means
 * hovering the padding — most of the control — would leave the icon inert if the animation hung
 * off the SVG itself, so every rule below is keyed on an ancestor `button` state instead.
 */
import React from 'react';
import styled, { keyframes } from 'styled-components';
import type { MoodIconProps } from './types';
import { WHEN_ACTIVE } from './whenActive';

const approve = keyframes`
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  18% {
    transform: translateY(0.22px) rotate(1.5deg) scale(0.99);
    animation-timing-function: cubic-bezier(0.5, 0, 0.75, 0.6);
  }
  52% {
    transform: translateY(-1.15px) rotate(-6deg) scale(1.12);
    animation-timing-function: cubic-bezier(0.2, 0.8, 0.4, 1);
  }
  74% { transform: translateY(-0.6px) rotate(-2.5deg) scale(1.06); }
  100% { transform: translateY(-0.85px) rotate(-4.5deg) scale(1.09); }
`;

const Svg = styled.svg`
  /* Pivots at the wrist, at the bottom of a thumb pointing up. */
  .thumb {
    transform-box: fill-box;
    transform-origin: 50% 92%;
  }

  ${WHEN_ACTIVE} {
    .thumb {
      animation: ${approve} 0.6s forwards;
    }
  }
  /* No Blade token for this yet, so the query is inline. */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
    }
  }
`;

const GoodIcon = ({ size = 28 }: MoodIconProps): React.ReactElement => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(1.795 1.795)">
        <circle cx="9" cy="9" r="9" fill="#FCC145" />
        <path
          d="M18 9C18 11.387 17.0518 13.6761 15.364 15.364C13.6762 17.0518 11.387 18 9.00001 18C6.61306 18 4.32387 17.0518 2.63604 15.364C0.948217 13.6761 0 11.387 0 9C0 6.61305 0.948217 4.32387 2.63604 2.63604C4.32387 0.948214 6.61306 0 9.00001 0C11.387 0 13.6762 0.948214 15.364 2.63604C17.0518 4.32387 18 6.61305 18 9ZM5.71202 8.59464C5.71202 8.43493 5.68056 8.2768 5.61945 8.12925C5.55833 7.98171 5.46875 7.84764 5.35582 7.73472C5.2429 7.62179 5.10884 7.53221 4.96129 7.4711C4.81375 7.40998 4.65561 7.37853 4.49591 7.37853C4.17338 7.37853 3.86406 7.50665 3.636 7.73472C3.40793 7.96278 3.2798 8.2721 3.2798 8.59464C3.2798 8.91717 3.40793 9.22649 3.636 9.45455C3.86406 9.68262 4.17338 9.81074 4.49591 9.81074C4.65561 9.81074 4.81375 9.77929 4.96129 9.71817C5.10884 9.65705 5.2429 9.56748 5.35582 9.45455C5.46875 9.34163 5.55833 9.20756 5.61945 9.06002C5.68056 8.91247 5.71202 8.75434 5.71202 8.59464ZM14.7202 8.59464C14.7202 8.2721 14.5921 7.96278 14.364 7.73472C14.136 7.50665 13.8266 7.37853 13.5041 7.37853C13.1816 7.37853 12.8723 7.50665 12.6442 7.73472C12.4161 7.96278 12.288 8.2721 12.288 8.59464C12.288 8.91717 12.4161 9.22649 12.6442 9.45455C12.8723 9.68262 13.1816 9.81074 13.5041 9.81074C13.8266 9.81074 14.136 9.68262 14.364 9.45455C14.5921 9.22649 14.7202 8.91717 14.7202 8.59464ZM11.5141 10.8917C10.2284 12.5419 7.86989 12.8899 6.63741 11.0555C6.36989 10.657 6.01228 10.5423 5.5646 10.7116C5.48817 10.7389 5.42403 10.7866 5.37217 10.8549C5.03914 11.2889 5.04868 11.7161 5.40082 12.1365C7.42766 14.5646 10.9531 14.5319 12.7507 11.8908C13.081 11.4076 12.9855 11.035 12.4641 10.773L12.333 10.7075C12.0082 10.5437 11.7352 10.6051 11.5141 10.8917Z"
          fill="#FCC145"
        />
        <g className="face">
          <path
            d="M4.49614 9.81112C5.16777 9.81112 5.71224 9.26665 5.71224 8.59501C5.71224 7.92338 5.16777 7.37891 4.49614 7.37891C3.8245 7.37891 3.28003 7.92338 3.28003 8.59501C3.28003 9.26665 3.8245 9.81112 4.49614 9.81112Z"
            fill="#50505A"
          />
          <path
            d="M13.5039 9.81112C14.1756 9.81112 14.72 9.26665 14.72 8.59501C14.72 7.92338 14.1756 7.37891 13.5039 7.37891C12.8323 7.37891 12.2878 7.92338 12.2878 8.59501C12.2878 9.26665 12.8323 9.81112 13.5039 9.81112Z"
            fill="#50505A"
          />
          <path
            d="M6.6372 11.0555C7.86969 12.8899 10.2282 12.5419 11.5139 10.8918C11.735 10.6051 12.008 10.5437 12.3328 10.7075L12.4639 10.773C12.9853 11.0351 13.0808 11.4077 12.7505 11.8908C10.9529 14.5319 7.42746 14.5646 5.40061 12.1365C5.04848 11.7161 5.03893 11.2889 5.37196 10.8549C5.42383 10.7867 5.48796 10.7389 5.5644 10.7116C6.01208 10.5424 6.36969 10.657 6.6372 11.0555Z"
            fill="#50505A"
          />
        </g>
        <g className="thumb">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.7715 11.2429C14.8381 11.0952 14.9867 11 15.1508 11C16.0677 11 16.8111 11.7326 16.8111 12.6364V13.8636H18.7432C19.1076 13.8603 19.4552 14.0145 19.6944 14.2855C19.9341 14.5572 20.0407 14.919 19.9859 15.275L19.4131 18.9567C19.32 19.5608 18.7901 20.0056 18.1704 19.9999H12.2452C11.5575 19.9999 11 19.4505 11 18.7727V15.9091C11 15.2313 11.5575 14.6818 12.2452 14.6818H13.2207L14.7715 11.2429Z"
            fill="white"
            stroke="#00733A"
            strokeWidth="0.818182"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </Svg>
  );
};

export { GoodIcon };
