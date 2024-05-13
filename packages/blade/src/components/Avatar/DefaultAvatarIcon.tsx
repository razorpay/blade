import { Svg, Path } from '~components/Icons/_Svg';
import type { IconComponent } from '~components/Icons';
import useIconProps from '~components/Icons/useIconProps';

const iconPropsToSizeMap = {
  xsmall: {
    height: '14',
    width: '14',
    bodyPath:
      'M0.928589 11.3881C1.55965 8.94407 3.72749 7.14289 6.3048 7.14289H7.69523C10.2725 7.14289 12.4404 8.94407 13.0714 11.3881C11.505 12.96 9.36258 13.9286 7.00002 13.9286C4.63745 13.9286 2.49507 12.96 0.928589 11.3881Z',
    headPath:
      'M4.21915 3.21432C4.21915 1.63637 5.46417 0.357178 7.00002 0.357178C8.53587 0.357178 9.78088 1.63637 9.78088 3.21432C9.78088 4.79228 8.53587 6.07146 7.00002 6.07146C5.46417 6.07146 4.21915 4.79228 4.21915 3.21432Z',
  },
  small: {
    height: '20',
    width: '18',
    bodyPath:
      'M0.5 15.9433C1.38348 12.5217 4.41846 10 8.0267 10H9.9733C13.5815 10 16.6166 12.5217 17.5 15.9433C15.3069 18.1439 12.3076 19.5 9 19.5C5.69241 19.5 2.69308 18.1439 0.5 15.9433Z',
    headPath:
      'M5.10679 4.5C5.10679 2.29086 6.84981 0.5 9 0.5C11.1502 0.5 12.8932 2.29086 12.8932 4.5C12.8932 6.70914 11.1502 8.5 9 8.5C6.84981 8.5 5.10679 6.70914 5.10679 4.5Z',
  },
  medium: {
    height: '26',
    width: '22',
    bodyPath:
      'M0.0714111 20.4985C1.20732 16.0992 5.10943 12.8571 9.74859 12.8571H12.2514C16.8905 12.8571 20.7927 16.0992 21.9286 20.4985C19.1089 23.3278 15.2526 25.0714 11 25.0714C6.74737 25.0714 2.89108 23.3278 0.0714111 20.4985Z',
    headPath:
      'M5.99443 5.78568C5.99443 2.94536 8.23546 0.642822 11 0.642822C13.7645 0.642822 16.0055 2.94536 16.0055 5.78568C16.0055 8.626 13.7645 10.9285 11 10.9285C8.23546 10.9285 5.99443 8.626 5.99443 5.78568Z',
  },
  large: {
    height: '34',
    width: '30',
    bodyPath:
      'M0.428589 27.3314C1.94313 21.4657 7.14594 17.1429 13.3315 17.1429H16.6685C22.8541 17.1429 28.057 21.4657 29.5714 27.3314C25.8119 31.1038 20.6702 33.4286 15 33.4286C9.32987 33.4286 4.18815 31.1038 0.428589 27.3314Z',
    headPath:
      'M8.32594 7.71432C8.32594 3.92723 11.314 0.857178 15 0.857178C18.6861 0.857178 21.6741 3.92723 21.6741 7.71432C21.6741 11.5014 18.6861 14.5715 15 14.5715C11.314 14.5715 8.32594 11.5014 8.32594 7.71432Z',
  },
  xlarge: {
    height: '38',
    width: '34',
    bodyPath:
      'M0 30.8866C1.76696 24.0433 7.83691 19 15.0534 19H18.9466C26.1631 19 32.2332 24.0433 34 30.8866C29.6138 35.2878 23.6152 38 17 38C10.3848 38 4.38616 35.2878 0 30.8866Z',
    headPath:
      'M9.21358 8C9.21358 3.58173 12.6996 0 17 0C21.3004 0 24.7864 3.58173 24.7864 8C24.7864 12.4183 21.3004 16 17 16C12.6996 16 9.21358 12.4183 9.21358 8Z',
  },
  // 2xlarge is not supported, but we need to include it to satisfy the type system
  '2xlarge': {
    height: undefined,
    width: undefined,
    bodyPath: undefined,
    headPath: undefined,
  },
};

const DefaultAvatarIcon: IconComponent = ({ color, size = 'xsmall', ...styledProps }) => {
  const { iconColor } = useIconProps({ color });
  const height = iconPropsToSizeMap[size].height;
  const width = iconPropsToSizeMap[size].width;
  const bodyPath = iconPropsToSizeMap[size].bodyPath;
  const headPath = iconPropsToSizeMap[size].headPath;

  return (
    <Svg
      {...styledProps}
      width={width as string}
      height={height as string}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path d={bodyPath as string} fill={iconColor} />
      <Path d={headPath as string} fill={iconColor} />
    </Svg>
  );
};

export { DefaultAvatarIcon };
