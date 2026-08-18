/**
 * Thumbs-down over a disappointed face.
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

/* Mirrors GoodIcon exactly, negated: the pair is one gesture in two directions. */
const reject = keyframes`
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  18% {
    transform: translateY(-0.22px) rotate(-1.5deg) scale(0.99);
    animation-timing-function: cubic-bezier(0.5, 0, 0.75, 0.6);
  }
  52% {
    transform: translateY(1.15px) rotate(6deg) scale(1.12);
    animation-timing-function: cubic-bezier(0.2, 0.8, 0.4, 1);
  }
  74% { transform: translateY(0.6px) rotate(2.5deg) scale(1.06); }
  100% { transform: translateY(0.85px) rotate(4.5deg) scale(1.09); }
`;

const recoil = keyframes`
  0% { transform: translate(0, 0); }
  55% { transform: translate(0.22px, 0.36px); }
  100% { transform: translate(0.16px, 0.28px); }
`;

const Svg = styled.svg`
  /*
   * Centred on the resting composite, which puts the press about a pixel past the box at its
   * deepest. Nothing between here and the button clips — the slot is an inline-flex span and the
   * button sets no overflow — so the frame is allowed to paint rather than shifting the artwork
   * off-centre for the other 99% of the time it is sitting still.
   */
  overflow: visible;

  .face {
    transform-box: fill-box;
    transform-origin: center;
  }

  /* Pivots at the wrist, which sits at the top of a thumb pointing down. */
  .thumb {
    transform-box: fill-box;
    transform-origin: 50% 8%;
  }

  ${WHEN_ACTIVE} {
    .thumb {
      animation: ${reject} 0.6s forwards;
    }

    .face {
      animation: ${recoil} 0.6s cubic-bezier(0.33, 0, 0.3, 1) forwards;
    }
  }
  /* No Blade token for this yet, so the query is inline. */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
    }
  }
`;

const BadIcon = ({ size = 28 }: MoodIconProps): React.ReactElement => {
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
      <g transform="translate(1.295 1.795)">
        <circle cx="12.4092" cy="9" r="9" fill={`url(#${gradientId})`} />
        <path
          d="M21.4092 9C21.4092 10.1819 21.1764 11.3522 20.7241 12.4442C20.2718 13.5361 19.6089 14.5282 18.7731 15.364C17.9374 16.1997 16.9453 16.8626 15.8533 17.3149C14.7614 17.7672 13.5911 18 12.4092 18C10.0222 18 7.73305 17.0518 6.04522 15.364C4.35739 13.6761 3.40918 11.3869 3.40918 9C3.40918 6.61305 4.35739 4.32387 6.04522 2.63604C7.73305 0.948212 10.0222 0 12.4092 0C14.7961 0 17.0853 0.948212 18.7731 2.63604C20.461 4.32387 21.4092 6.61305 21.4092 9ZM8.95331 7.45223C9.14712 7.41947 9.33275 7.36078 9.51018 7.27616C10.0548 7.02229 10.063 6.28935 9.65759 5.88399C9.56936 5.79704 9.45841 5.73671 9.33747 5.70991C9.21653 5.68312 9.09049 5.69094 8.97379 5.73248C8.13848 6.03003 7.28543 6.31392 6.41464 6.58417C5.97652 6.71929 5.82092 7.14923 5.86596 7.56688C5.87836 7.67071 5.9193 7.7692 5.98431 7.85154C6.04932 7.93388 6.13587 7.9969 6.23448 8.03367C6.52383 8.14013 6.68216 8.34895 6.70946 8.66014C6.85686 10.4782 9.54294 9.98271 9.05977 8.18926C9.02975 8.08553 8.97515 7.99955 8.89599 7.9313C8.85504 7.89581 8.81956 7.8535 8.78953 7.80437C8.67215 7.6051 8.72674 7.48772 8.95331 7.45223ZM16.0043 7.73476C14.6162 9.62648 18.0188 10.8631 18.1335 8.51274C18.1389 8.36533 18.2072 8.25751 18.3382 8.18926L18.6207 8.03776C18.7524 7.9674 18.8607 7.86006 18.9321 7.72897C19.0036 7.59789 19.0352 7.44876 19.023 7.29995C19.0108 7.15114 18.9554 7.00914 18.8636 6.89142C18.7717 6.7737 18.6475 6.68541 18.5061 6.6374L15.82 5.73658C15.6792 5.69 15.5266 5.69255 15.3869 5.74382C15.2472 5.79509 15.1286 5.89208 15.0502 6.01911C14.8482 6.35487 14.8168 6.67152 14.956 6.96906C15.0216 7.10828 15.1294 7.19973 15.2795 7.2434L15.9019 7.43176C16.0793 7.48362 16.1135 7.58462 16.0043 7.73476ZM9.56751 12.3617C9.25085 12.55 9.10754 12.8244 9.13757 13.1847C9.14948 13.3283 9.20027 13.4652 9.2849 13.5818C9.36953 13.6984 9.48506 13.7907 9.62001 13.8494C9.75496 13.9082 9.90463 13.9315 10.0542 13.9168C10.2037 13.9022 10.3479 13.8503 10.4724 13.7662C11.6517 12.9677 13.4124 13.025 14.7964 13.111C15.3532 13.1438 15.6439 12.8831 15.6685 12.3289L15.6767 12.2061C15.6931 11.8157 15.5075 11.5933 15.1198 11.5387C13.2158 11.2684 11.1521 11.4158 9.56751 12.3617Z"
          fill={`url(#${gradientId})`}
        />
        <g className="face">
          <path
            d="M8.78968 7.8044C8.81971 7.85353 8.8552 7.89584 8.89614 7.93133C8.9753 7.99958 9.0299 8.08556 9.05993 8.18929C9.54309 9.98274 6.85702 10.4782 6.70961 8.66018C6.68231 8.34898 6.52399 8.14016 6.23463 8.0337C6.13602 7.99693 6.04947 7.93391 5.98447 7.85157C5.91946 7.76923 5.87851 7.67074 5.86611 7.56691C5.82107 7.14926 5.97667 6.71932 6.4148 6.5842C7.28559 6.31395 8.13864 6.03006 8.97394 5.73251C9.09064 5.69097 9.21668 5.68315 9.33763 5.70994C9.45857 5.73674 9.56951 5.79707 9.65774 5.88402C10.0631 6.28938 10.0549 7.02232 9.51034 7.27619C9.3329 7.36081 9.14728 7.4195 8.95347 7.45226C8.7269 7.48775 8.6723 7.60513 8.78968 7.8044Z"
            fill="#50505A"
          />
          <path
            d="M15.9017 7.43147L15.2793 7.24311C15.1291 7.19944 15.0213 7.10799 14.9558 6.96877C14.8166 6.67123 14.848 6.35458 15.05 6.01882C15.1283 5.89179 15.2469 5.7948 15.3866 5.74353C15.5263 5.69226 15.6789 5.68971 15.8198 5.73629L18.5059 6.63711C18.6472 6.68512 18.7715 6.77341 18.8633 6.89113C18.9552 7.00885 19.0106 7.15085 19.0228 7.29966C19.035 7.44847 19.0034 7.5976 18.9319 7.72869C18.8604 7.85977 18.7522 7.96711 18.6205 8.03747L18.338 8.18897C18.2069 8.25722 18.1387 8.36504 18.1332 8.51245C18.0186 10.8628 14.616 9.62619 16.004 7.73447C16.1132 7.58433 16.0791 7.48333 15.9017 7.43147Z"
            fill="#50505A"
          />
          <path
            d="M9.56738 12.3624C11.152 11.4166 13.2157 11.2692 15.1197 11.5394C15.5073 11.594 15.693 11.8165 15.6766 12.2068L15.6684 12.3297C15.6438 12.8838 15.3531 13.1445 14.7962 13.1118C13.4122 13.0258 11.6515 12.9684 10.4723 13.7669C10.3478 13.851 10.2036 13.903 10.054 13.9176C9.90451 13.9322 9.75483 13.909 9.61988 13.8502C9.48493 13.7914 9.3694 13.6991 9.28477 13.5825C9.20014 13.4659 9.14935 13.329 9.13745 13.1855C9.10742 12.8251 9.25073 12.5508 9.56738 12.3624Z"
            fill="#50505A"
          />
        </g>
        <g className="thumb">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.6377 19.7571C5.57108 19.9048 5.42243 20 5.2584 20C4.34143 20 3.59809 19.2674 3.59809 18.3636V17.1364H1.66595C1.30156 17.1397 0.95393 16.9855 0.714762 16.7145C0.475031 16.4428 0.368464 16.081 0.423289 15.725L0.996089 12.0433C1.08921 11.4392 1.61906 10.9944 2.23879 11.0001H8.16395C8.85167 11.0001 9.40918 11.5495 9.40918 12.2273V15.0909C9.40918 15.7687 8.85167 16.3182 8.16395 16.3182H7.18846L5.6377 19.7571Z"
            fill="white"
            stroke="#A8180E"
            strokeWidth="0.818182"
            strokeLinecap="round"
            strokeLinejoin="round"
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
          gradientTransform="translate(12.4092 9) rotate(90) scale(9)"
        >
          <stop stopColor="#FDC54E" />
          <stop offset="0.586893" stopColor="#FDB62A" />
          <stop offset="1" stopColor="#FD6364" />
        </radialGradient>
      </defs>
    </Svg>
  );
};

export { BadIcon };
