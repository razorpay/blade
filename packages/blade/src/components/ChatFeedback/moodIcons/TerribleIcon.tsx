/**
 * Crying face — the worst rung of the scale.
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

const droop = keyframes`
  0%, 100% { transform: translateY(0) scaleY(1); }
  55% { transform: translateY(0.35px) scaleY(0.985); }
`;

/* Starts and ends on the resting pose, so hovering on or off never jumps the tear. */
const fall = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  18% { transform: translate(0.15px, 0.3px) scale(0.85); opacity: 0; }
  19% { transform: translate(-0.8px, -4.2px) scale(0.34); opacity: 0; }
  26% { transform: translate(-0.75px, -4px) scale(0.5); opacity: 1; }
  40% {
    transform: translate(-0.55px, -3.1px) scale(0.7);
    opacity: 1;
    animation-timing-function: cubic-bezier(0.5, 0, 0.85, 0.45);
  }
  78% { transform: translate(-0.05px, -0.15px) scale(1.02); opacity: 1; }
  94% { transform: translate(0, 0) scale(1.02); opacity: 1; }
  100% { transform: translate(0, 0) scale(1); opacity: 1; }
`;

const Svg = styled.svg`
  .face {
    transform-box: fill-box;
    transform-origin: center;
  }

  /* The tear stays visible at rest — without it this reads as a plain sad face. */
  .tear {
    transform-box: fill-box;
    transform-origin: 50% 0%;
  }

  ${WHEN_ACTIVE} {
    .face {
      animation: ${droop} 2.8s ease-in-out infinite;
    }

    .tear {
      animation: ${fall} 2.8s linear infinite;
    }
  }
  /* No Blade token for this yet, so the query is inline. */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
    }
  }
`;

const TerribleIcon = ({ size = 28 }: MoodIconProps): React.ReactElement => {
  const gradientId = React.useId();

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
      <g transform="translate(3 3)">
        <circle cx="9" cy="9" r="9" fill={`url(#${gradientId})`} />
        <path
          d="M16.6502 13.7289L15.9014 12.5276C15.8715 12.4797 15.8309 12.4395 15.7827 12.4099C15.7345 12.3803 15.6801 12.3623 15.6235 12.3572C15.5669 12.352 15.5098 12.3599 15.4565 12.3803C15.4032 12.4006 15.3552 12.4329 15.3162 12.4745C14.2605 13.6213 13.8499 14.9328 14.0845 16.4092C11.1874 18.2015 8.32163 18.4793 5.48725 17.2427C0.495016 15.0567 -1.5387 9.02198 1.27659 4.42543C3.89137 0.159827 9.24779 -1.24978 13.5239 1.20171C15.379 2.26403 16.6884 3.87793 17.4522 6.04342C18.3907 8.70193 18.1233 11.2637 16.6502 13.7289ZM5.72867 8.58889C5.72867 8.26705 5.60063 7.95839 5.37271 7.73082C5.1448 7.50325 4.83568 7.3754 4.51335 7.3754C4.19103 7.3754 3.88191 7.50325 3.65399 7.73082C3.42607 7.95839 3.29803 8.26705 3.29803 8.58889C3.29803 8.91072 3.42607 9.21938 3.65399 9.44695C3.88191 9.67453 4.19103 9.80238 4.51335 9.80238C4.83568 9.80238 5.1448 9.67453 5.37271 9.44695C5.60063 9.21938 5.72867 8.91072 5.72867 8.58889ZM14.7311 8.58889C14.7311 8.26705 14.603 7.95839 14.3751 7.73082C14.1472 7.50325 13.8381 7.3754 13.5157 7.3754C13.1934 7.3754 12.8843 7.50325 12.6564 7.73082C12.4285 7.95839 12.3004 8.26705 12.3004 8.58889C12.3004 8.91072 12.4285 9.21938 12.6564 9.44695C12.8843 9.67453 13.1934 9.80238 13.5157 9.80238C13.8381 9.80238 14.1472 9.67453 14.3751 9.44695C14.603 9.21938 14.7311 8.91072 14.7311 8.58889ZM6.47751 12.8872C8.01201 10.9219 10.0335 10.9382 11.6375 12.928C11.7252 13.0366 11.8489 13.1103 11.9862 13.1358C12.1235 13.1613 12.2655 13.1369 12.3863 13.067C12.5418 12.9771 12.6605 12.8599 12.7423 12.7156C13.007 12.2471 12.9442 11.8276 12.5541 11.4571C10.2353 9.25079 7.91516 9.21538 5.59364 11.3509C5.3563 11.5715 5.20353 11.8712 5.13533 12.2498C5.10533 12.4132 5.14352 12.5589 5.24991 12.687C5.47634 12.9621 5.76004 13.0942 6.10104 13.0833C6.17397 13.0808 6.24559 13.0619 6.3107 13.0279C6.37581 12.994 6.43279 12.9459 6.47751 12.8872Z"
          fill={`url(#${gradientId})`}
        />
        <g className="face">
          <g className="tear">
            {/* Grown from the point it meets the cheek, so the drop gets bigger without
                detaching. Inside the animated group, not around it, so the fall keeps the
                travel distances it was tuned with rather than scaling those up too. */}
            <g transform="translate(15.621 12.355) scale(1.5) translate(-15.621 -12.355)">
              <path
                d="M16.6499 13.7287C17.5311 15.3358 17.3933 16.4389 16.2366 17.0382C15.5383 17.3977 14.8208 17.188 14.0842 16.409C13.8496 14.9326 14.2602 13.6211 15.3159 12.4743C15.3549 12.4327 15.403 12.4005 15.4562 12.3801C15.5095 12.3598 15.5667 12.3519 15.6232 12.357C15.6798 12.3621 15.7343 12.3802 15.7825 12.4097C15.8306 12.4393 15.8712 12.4796 15.9011 12.5274L16.6499 13.7287Z"
                fill="#2EB6FF"
              />
              <ellipse
                cx="15.35"
                cy="15.95"
                rx="0.4"
                ry="0.62"
                transform="rotate(-16 15.35 15.95)"
                fill="#FFFFFF"
                opacity="0.5"
              />
            </g>
          </g>
          <path
            d="M4.51354 9.80296C5.18494 9.80296 5.72922 9.25966 5.72922 8.58947C5.72922 7.91927 5.18494 7.37598 4.51354 7.37598C3.84213 7.37598 3.29785 7.91927 3.29785 8.58947C3.29785 9.25966 3.84213 9.80296 4.51354 9.80296Z"
            fill="#50505A"
          />
          <path
            d="M13.516 9.80296C14.1874 9.80296 14.7317 9.25966 14.7317 8.58947C14.7317 7.91927 14.1874 7.37598 13.516 7.37598C12.8446 7.37598 12.3003 7.91927 12.3003 8.58947C12.3003 9.25966 12.8446 9.80296 13.516 9.80296Z"
            fill="#50505A"
          />
          <path
            d="M11.6378 12.928C10.0338 10.9382 8.01231 10.9219 6.47781 12.8872C6.43309 12.9459 6.37611 12.994 6.311 13.0279C6.24589 13.0619 6.17427 13.0808 6.10134 13.0833C5.76035 13.0942 5.47664 12.9621 5.25021 12.687C5.14382 12.559 5.10563 12.4132 5.13563 12.2498C5.20383 11.8712 5.3566 11.5715 5.59394 11.3509C7.91546 9.21538 10.2356 9.2508 12.5544 11.4571C12.9445 11.8276 13.0073 12.2471 12.7426 12.7156C12.6608 12.8599 12.5421 12.9771 12.3866 13.067C12.2658 13.1369 12.1238 13.1613 11.9865 13.1358C11.8492 13.1103 11.7255 13.0366 11.6378 12.928Z"
            fill="#50505A"
          />
        </g>
      </g>
      <defs>
        <radialGradient
          id={gradientId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(9 9) rotate(90) scale(9)"
        >
          <stop stopColor="#FDC54E" />
          <stop offset="0.586893" stopColor="#FB7157" />
          <stop offset="1" stopColor="#FD6364" />
        </radialGradient>
      </defs>
    </Svg>
  );
};

export { TerribleIcon };
