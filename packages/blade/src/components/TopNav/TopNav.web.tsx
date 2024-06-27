import React from 'react';
import { TopNavContext } from './TopNavContext';
import type { BoxProps } from '~components/Box';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Divider } from '~components/Divider';
import {
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
} from '~components/SideNav/tokens';
import { size } from '~tokens/global';
import { makeSize } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const TOP_NAV_HEIGHT = size[56];
const CONTENT_RIGHT_GAP = size[80];

const RazorpayLinesSvg = (): React.ReactElement => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="304"
      height="56"
      viewBox="0 0 304 56"
      fill="none"
    >
      <path
        opacity="0.17"
        d="M-20.1729 -528.246L-57.1316 -544.114C-61.2709 -545.885 -65.9797 -543.057 -65.9797 -538.799L-66 -515.846C-66 -511.217 -63.1422 -506.998 -58.6571 -505.045L21.4336 -470.072C23.427 -469.205 25.7255 -469.195 27.729 -470.062L92.7067 -498.197C97.5783 -500.302 103.141 -496.978 103.141 -491.949L103.141 -396.886C103.141 -388.781 98.1173 -381.418 90.2557 -378.018L-10.1145 -334.568C-14.986 -332.463 -20.5492 -335.787 -20.5492 -340.816V-436.66C-20.5492 -442.232 -14.3759 -445.918 -8.97546 -443.575L16.0637 -432.689C19.5724 -431.165 19.5725 -426.488 16.0739 -424.964L-55.067 -393.914C-61.7387 -391 -66 -384.742 -66 -377.847L-65.9695 -119.356C-65.9695 -115.585 -61.7895 -113.089 -58.1384 -114.68L-25.2072 -129.062C-22.0036 -130.462 -18.3015 -130.462 -15.0877 -129.071L106.416 -76.4016C110.393 -74.6777 110.403 -69.3822 106.426 -67.6392L31.7462 -35.047C28.5121 -33.6373 24.8203 -35.847 24.8203 -39.1805V-79.3637C24.8203 -87.4498 29.8342 -94.8027 37.6653 -98.2124L152.65 -148.215C156.993 -150.101 161.956 -147.139 161.956 -142.653L161.956 -56.6672C161.956 -53.9337 163.644 -51.4383 166.299 -50.2859L200.583 -35.3041C203.756 -33.9231 207.386 -36.0851 207.386 -39.3615L207.386 -59.2102C207.386 -67.3154 212.411 -74.6777 220.272 -78.0779L300.297 -112.675C305.169 -114.78 310.732 -111.456 310.732 -106.427L310.732 -11.3648C310.732 -3.25959 305.708 4.10269 297.846 7.50287L217.801 42.0905C212.929 44.1953 207.366 40.8714 207.366 35.8425V14.4604C207.366 10.1649 204.712 6.26945 200.562 4.4503L139.666 -21.9607C135.863 -23.6274 131.5 -21.0273 131.5 -17.0938L131.5 86.7882M166.281 98.6523C118.572 77.8195 44.1159 45.3065 44.1159 45.3065C41.6242 44.2208 41.6242 40.8968 44.1159 39.811L111.034 9.76487C113.2 8.82196 113.2 5.94561 111.034 5.0027L76.8005 -9.94099C73.1494 -11.5411 68.9185 -11.5411 65.2674 -9.94099L-65.3288 47.0907L25.583 86.7882L247.183 -9.55048C250.966 -11.1982 253.387 -14.7413 253.387 -18.6462L253.387 -204.704C253.387 -208.38 251.108 -211.733 247.549 -213.285L213.173 -228.296C210.468 -229.477 207.366 -227.629 207.366 -224.829L207.386 -164.397C207.386 -158.101 214.373 -153.93 220.465 -156.596L380.881 -226.658C384.766 -228.353 389.21 -225.696 389.21 -221.686L389.21 -121.242C389.21 -116.823 384.308 -113.899 380.026 -115.766L309.414 -146.577C302.611 -149.548 298.268 -155.939 298.268 -162.959V-221.752C298.268 -227.277 301.685 -232.296 307.035 -234.629L379.05 -266.079C382.915 -267.765 382.905 -272.908 379.04 -274.593L262.255 -325.234C258.278 -326.958 258.268 -332.254 262.245 -333.997L336.925 -366.589C340.159 -367.999 343.851 -365.789 343.851 -362.455L343.851 -303.224C343.851 -295.137 338.837 -287.785 331.006 -284.375L216.021 -234.372C211.678 -232.486 206.715 -235.448 206.715 -239.934L206.715 -344.969C206.715 -347.702 205.027 -350.198 202.373 -351.35L168.089 -366.332C164.916 -367.713 161.285 -365.551 161.285 -362.275V-342.426C161.285 -334.321 156.261 -326.958 148.399 -323.558L35.3262 -274.593C30.4546 -272.489 24.8915 -275.813 24.8915 -280.841L24.8915 -375.904C24.8915 -384.009 29.9156 -391.371 37.7772 -394.772L150.85 -443.737C155.722 -445.842 161.285 -442.518 161.285 -437.489V-416.106C161.285 -411.811 163.939 -407.915 168.089 -406.096L244.701 -372.599C248.505 -370.932 252.868 -373.532 252.868 -377.466L252.868 -481.348C252.868 -485.653 250.193 -489.568 246.023 -491.378L169.401 -524.56C165.597 -526.208 161.254 -523.608 161.254 -519.684V-496.578C161.254 -491.597 164.336 -487.073 169.157 -484.968L291.322 -431.622C293.813 -430.536 293.813 -427.212 291.322 -426.126L257.617 -411.411C255.451 -410.468 255.451 -407.591 257.617 -406.648L291.85 -391.705C295.502 -390.105 299.732 -390.105 303.383 -391.705L434 -448.699L343.088 -488.397L121.489 -392.076C117.705 -390.428 115.285 -386.885 115.285 -382.98L115.285 -196.923C115.285 -193.246 117.563 -189.894 121.122 -188.341L155.498 -173.331C158.203 -172.15 161.305 -173.997 161.305 -176.798L161.285 -237.23C161.285 -243.525 154.298 -247.697 148.206 -245.03L-12.2096 -174.978C-16.0946 -173.283 -20.539 -175.94 -20.539 -179.95L-20.539 -280.394C-20.539 -284.813 -15.6369 -287.737 -11.3552 -285.87L59.2567 -255.059C66.0606 -252.087 70.4034 -245.697 70.4034 -238.677L70.4034 -179.884C70.4034 -174.359 66.9861 -169.34 61.6366 -167.007L-8.56866 -136.348"
        stroke="url(#paint0_linear_89426_105396)"
        strokeMiterlimit="10"
      />
      <defs>
        <linearGradient
          id="paint0_linear_89426_105396"
          x1="162.854"
          y1="63.9672"
          x2="160.504"
          y2="-544.656"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F9ADA" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
};

type TopNavProps = {
  children: React.ReactNode;
} & Pick<
  BoxProps,
  | 'padding'
  | 'paddingTop'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingX'
  | 'paddingY'
  | 'backgroundColor'
  | 'position'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'width'
  | 'zIndex'
>;

const TopNav = ({ children, ...styledProps }: TopNavProps): React.ReactElement => {
  return (
    <TopNavContext.Provider value={{ backgroundColor: styledProps.backgroundColor }}>
      <Box
        display="grid"
        gridTemplateColumns={{ base: 'minmax(0, 1fr) auto', m: 'auto minmax(0, 1fr) auto' }}
        alignItems="center"
        position="sticky"
        top="0px"
        width="100%"
        paddingX="spacing.3"
        height={makeSize(TOP_NAV_HEIGHT)}
        zIndex={1}
        {...styledProps}
        {...metaAttribute({ name: MetaConstants.TopNav })}
      >
        {children}
        <Box position="absolute" top="0px" left="0px" pointerEvents="none">
          <RazorpayLinesSvg />
        </Box>
      </Box>
    </TopNavContext.Provider>
  );
};

const TopNavBrand = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box
      display={{
        base: 'none',
        m: 'flex',
      }}
      flexDirection="row"
      marginTop="spacing.4"
      width={{
        base: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
        xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
      }}
      {...metaAttribute({ name: MetaConstants.TopNavBrand })}
    >
      <BaseBox width="100%" textAlign="center">
        {children}
      </BaseBox>
      <Box alignSelf="center" display={{ base: 'none', m: 'block' }}>
        <Divider
          marginRight="-1px"
          height={makeSize(size[20])}
          alignSelf="center"
          orientation="vertical"
        />
      </Box>
    </Box>
  );
};

const TopNavContent = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      alignItems="center"
      marginLeft={{ base: 'spacing.0', m: 'spacing.4' }}
      paddingRight={{ base: 'spacing.0', m: makeSize(CONTENT_RIGHT_GAP) }}
      {...metaAttribute({ name: MetaConstants.TopNavContent })}
    >
      {children}
    </BaseBox>
  );
};

const TopNavActions = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      gap="spacing.3"
      alignItems="center"
      marginTop="spacing.1"
      {...metaAttribute({ name: MetaConstants.TopNavActions })}
    >
      {children}
    </BaseBox>
  );
};

export { TopNav, TopNavBrand, TopNavContent, TopNavActions };
export type { TopNavProps };
