import type { BladeFile } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Svg, Path } from '~components/Icons/_Svg';
import { Text } from '~components/Typography';
import { useTheme } from '~utils';
import getIn from '~utils/lodashButBetter/get';

type FileUploadItemIconProps = { fileName: string; uploadStatus: BladeFile['status'] };

const FileUploadItemIcon: React.ComponentType<FileUploadItemIconProps> = ({
  fileName,
  uploadStatus,
  ...styledProps
}: FileUploadItemIconProps) => {
  const { theme } = useTheme();

  if (uploadStatus === 'error') {
    return (
      <Svg {...styledProps} width="38" height="38" viewBox="0 0 38 38" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.95314 2.04416C6.56342 1.3756 7.39114 1 8.25422 1H26.0591L33.2032 8.82636V33.085C33.2032 34.0305 32.8603 34.9373 32.2501 35.6058C31.6398 36.2744 30.8121 36.65 29.949 36.65H8.25422C7.39114 36.65 6.56342 36.2744 5.95314 35.6058C5.34285 34.9373 5 34.0305 5 33.085V4.565C5 3.6195 5.34285 2.71273 5.95314 2.04416ZM24.2408 14.2499C25.5737 15.5828 26.3224 17.3905 26.3224 19.2755C26.3224 21.1604 25.5737 22.9682 24.2408 24.301C22.9079 25.6339 21.1002 26.3827 19.2152 26.3827C17.3303 26.3827 15.5225 25.6339 14.1897 24.301C12.8568 22.9682 12.108 21.1604 12.108 19.2755C12.108 17.3905 12.8568 15.5828 14.1897 14.2499C15.5225 12.917 17.3303 12.1683 19.2152 12.1683C21.1002 12.1683 22.9079 12.917 24.2408 14.2499ZM19.926 20.46V15.248C19.926 15.0596 19.8511 14.8788 19.7178 14.7455C19.5845 14.6122 19.4037 14.5373 19.2152 14.5373C19.0267 14.5373 18.846 14.6122 18.7127 14.7455C18.5794 14.8788 18.5045 15.0596 18.5045 15.248V20.46C18.5045 20.6485 18.5794 20.8293 18.7127 20.9626C18.846 21.0958 19.0267 21.1707 19.2152 21.1707C19.4037 21.1707 19.5845 21.0958 19.7178 20.9626C19.8511 20.8293 19.926 20.6485 19.926 20.46ZM19.8853 23.736C20.063 23.5583 20.1629 23.3173 20.1629 23.066C20.1629 22.8146 20.063 22.5736 19.8853 22.3959C19.7076 22.2182 19.4666 22.1183 19.2152 22.1183C18.9639 22.1183 18.7229 22.2182 18.5452 22.3959C18.3674 22.5736 18.2676 22.8146 18.2676 23.066C18.2676 23.3173 18.3674 23.5583 18.5452 23.736C18.7229 23.9138 18.9639 24.0136 19.2152 24.0136C19.4666 24.0136 19.7076 23.9138 19.8853 23.736Z"
          fill={getIn(theme.colors, 'interactive.icon.negative.muted')}
        />
      </Svg>
    );
  }

  const FILE_EXTENSION_REGEX = /(?:\.([^.]+))?$/i;
  const [fileExtension, fileType] = FILE_EXTENSION_REGEX.exec(fileName) ?? [];

  let iconBackgroundColor = '#46265C';
  let iconColor = '#46265C';

  switch (fileType) {
    case 'pdf':
      iconBackgroundColor = 'surface.icon.gray.muted';
      iconColor = 'feedback.icon.negative.intense';
      break;
    case 'doc':
    case 'docx':
      iconBackgroundColor = '#00A7F199';
      iconColor = '#005AC1';
      break;
    case 'xls':
    case 'xlsx':
      iconBackgroundColor = 'feedback.icon.positive.intense';
      iconColor = 'feedback.icon.positive.intense';
      break;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      iconBackgroundColor = 'feedback.icon.information.intense';
      iconColor = 'feedback.icon.information.intense';
      break;
    default:
      iconColor = '#46265C';
  }

  // When iconColor is not a hex color, it is a token. Design has used colors which are not in the theme.
  if (!iconColor.startsWith('#')) {
    // @ts-expect-error In this case, iconColor is a token
    iconColor = getIn(theme.colors, iconColor);
    // @ts-expect-error In this case, iconColor is a token
    iconBackgroundColor = getIn(theme.colors, iconBackgroundColor);
  }

  return (
    <BaseBox position="relative" display="flex" flexDirection="column" alignItems="center">
      <Svg {...styledProps} width="33" height="36" viewBox="0 0 33 36" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.44238 0C4.59001 0 3.77255 0.375623 3.16983 1.04424C2.56712 1.71285 2.22852 2.61968 2.22852 3.56524V32.0872C2.22852 33.0327 2.56712 33.9396 3.16983 34.6082C3.77255 35.2768 4.59001 35.6524 5.44238 35.6524H26.8681C27.7205 35.6524 28.5379 35.2768 29.1406 34.6082C29.7434 33.9396 30.082 33.0327 30.082 32.0872V7.82689L23.0265 0H5.44238Z"
          fill={iconBackgroundColor}
          fillOpacity={fileType === 'pdf' ? 0.4 : 0.6}
        />

        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 17.8262H32.31V30.0817H0V17.8262Z"
          fill={iconColor}
        />

        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30.0823 30.359C30.0823 30.2855 30.1058 30.215 30.1476 30.163C30.1895 30.111 30.2463 30.0818 30.3055 30.0818L32.2027 30.0818C32.3254 30.0818 32.3477 30.1649 32.2473 30.262L30.2608 32.2579C30.1604 32.3549 30.0823 32.3133 30.0823 32.1608L30.0823 30.359Z"
          fill={iconColor}
        />

        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.22828 30.359C2.22828 30.2855 2.20476 30.215 2.1629 30.163C2.12105 30.111 2.06427 30.0818 2.00508 30.0818L0.107893 30.0818C-0.0148658 30.0818 -0.0371856 30.1649 0.0632536 30.262L2.04972 32.2579C2.15016 32.3549 2.22828 32.3133 2.22828 32.1608L2.22828 30.359Z"
          fill={iconColor}
        />
      </Svg>
      <Text position="absolute" top="45%" color="interactive.text.staticWhite.normal" size="xsmall">
        {fileExtension}
      </Text>
    </BaseBox>
  );
};

export { FileUploadItemIcon };
