import type { IconComponent } from '~components/Icons';
import useIconProps from '~components/Icons/useIconProps';
import Svg, { Path } from '~components/Icons/_Svg';

const TrustedBadgeIcon: IconComponent = (props) => {
  const { width, height } = useIconProps(props);
  return (
    <Svg display="block" width={width} height={height} viewBox="0 0 19 20" fill="none">
      <Path
        d="M18.1763 3.12496C14.4216 3.12496 11.5452 2.14992 9.11271 0C6.68058 2.14992 3.80428 3.12496 0.0498704 3.12496C0.0498704 8.72327 -1.22466 16.7433 9.11271 20C19.4508 16.7432 18.1763 8.72327 18.1763 3.12496Z"
        fill="url(#paint0_linear_89597_146569)"
      />
      <g filter="url(#filter0_i_89597_146569)">
        <Path
          d="M16.9345 4.04107C13.6801 4.04107 11.1869 3.19596 9.07861 1.33252C6.97056 3.19596 4.47753 4.04107 1.2234 4.04107C1.2234 8.8934 0.118706 15.8448 9.07861 18.6675C18.0391 15.8447 16.9345 8.8934 16.9345 4.04107Z"
          fill="url(#paint1_linear_89597_146569)"
        />
      </g>
      <g opacity="0.21" filter="url(#filter1_f_89597_146569)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.5245 2.30005C8.52447 2.30007 8.52443 2.3001 8.67861 2.48494C8.83278 2.66978 8.83273 2.66982 8.83268 2.66987L8.83254 2.66998L8.83095 2.67126L8.82684 2.67456C8.82335 2.67735 8.81835 2.68132 8.81188 2.68641C8.79895 2.69659 8.78014 2.71123 8.7557 2.72983C8.70683 2.76703 8.63543 2.82008 8.5436 2.8849C8.36002 3.0145 8.0943 3.19147 7.76321 3.38298C7.10245 3.76518 6.1741 4.20952 5.11373 4.44724C4.07693 4.67968 3.24422 4.80779 2.66922 4.87785C2.38171 4.91288 2.15861 4.9334 2.00659 4.94519C2.00136 4.94559 1.99621 4.94599 1.99115 4.94637C1.98673 5.02812 1.98148 5.13199 1.97603 5.2548C1.96151 5.58157 1.94554 6.04208 1.93973 6.57633C1.92809 7.64707 1.95743 9.00508 2.11864 10.1751L1.63775 10.2395C1.4718 9.03519 1.44272 7.65004 1.45445 6.57119C1.46032 6.03065 1.47648 5.56477 1.49118 5.23384C1.49853 5.06835 1.50552 4.93652 1.51068 4.8459C1.51326 4.80058 1.51539 4.76556 1.51688 4.74177C1.51762 4.72988 1.5182 4.72079 1.5186 4.71463L1.51923 4.70512C1.51923 4.70508 1.51924 4.70505 1.76136 4.72097L1.51924 4.70505L1.53378 4.48989L1.75214 4.48178L1.75223 4.48178L1.75254 4.48177L1.75466 4.48168C1.75668 4.48159 1.75989 4.48145 1.76428 4.48125C1.77307 4.48084 1.7866 4.48016 1.80477 4.47912C1.8411 4.47706 1.89597 4.47357 1.96855 4.46794C2.1137 4.45668 2.32965 4.43686 2.60973 4.40273C3.16991 4.33448 3.98651 4.20902 5.00618 3.98042C6.00229 3.75711 6.88327 3.337 7.51772 2.97002C7.83423 2.78694 8.08758 2.61813 8.26117 2.4956C8.34792 2.43436 8.41464 2.38476 8.45923 2.35081C8.48152 2.33385 8.49828 2.3208 8.50924 2.31218C8.51471 2.30787 8.51874 2.30466 8.52129 2.30263L8.52398 2.30047L8.5245 2.30005Z"
          fill="url(#paint2_linear_89597_146569)"
        />
      </g>
      <g filter="url(#filter2_d_89597_146569)">
        <Path
          d="M8.17223 7.68163L7.72705 9.30015L10.2744 7.67253L8.60851 13.8131L10.3002 13.8147L12.7611 4.74487L8.17223 7.68163Z"
          fill="white"
        />
        <Path
          d="M5.42984 11.2342L4.72949 13.8156H8.19707C8.19707 13.8156 9.61539 8.5655 9.61579 8.56396C9.61446 8.5648 5.42984 11.2342 5.42984 11.2342Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_89597_146569"
          x="1.18018"
          y="1.33252"
          width="16.087"
          height="18.0108"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="0.289647" dy="0.675842" />
          <feGaussianBlur stdDeviation="0.917215" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0409375 0 0 0 0 0.545833 0 0 0 0 0.297457 0 0 0 1 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_89597_146569" />
        </filter>
        <filter
          id="filter1_f_89597_146569"
          x="0.973095"
          y="1.821"
          width="8.33848"
          height="8.89756"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="0.239527" result="effect1_foregroundBlur_89597_146569" />
        </filter>
        <filter
          id="filter2_d_89597_146569"
          x="3.18471"
          y="3.29664"
          width="12.473"
          height="13.5121"
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
          <feOffset dx="0.675842" dy="0.772391" />
          <feGaussianBlur stdDeviation="1.11031" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.126389 0 0 0 0 0.541667 0 0 0 0 0.337377 0 0 0 0.3 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_89597_146569"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_89597_146569"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_89597_146569"
          x1="21.5964"
          y1="16.117"
          x2="-1.81118"
          y2="4.46791"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.10771" stopColor="#30CF66" />
          <stop offset="0.670861" stopColor="#80F399" />
          <stop offset="0.876285" stopColor="#93F9BC" />
          <stop offset="0.953125" stopColor="#A9F19D" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_89597_146569"
          x1="15.5081"
          y1="18.6675"
          x2="-4.34671"
          y2="4.13441"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2EAE52" />
          <stop offset="1" stopColor="#6CE8AB" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_89597_146569"
          x1="9.75263"
          y1="1.99064"
          x2="2.49084"
          y2="9.77064"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.544957" stopColor="#7AF09B" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </Svg>
  );
};

export { TrustedBadgeIcon };
