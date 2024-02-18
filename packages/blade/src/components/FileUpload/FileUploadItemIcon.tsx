import BaseBox from '~components/Box/BaseBox';
import { Svg, Path } from '~components/Icons/_Svg';
import { Text } from '~components/Typography';
import { useTheme } from '~utils';
import getIn from '~utils/lodashButBetter/get';

type FileUploadItemIconProps = { fileName: string };

// TODO: add error icon
const FileUploadItemIcon: React.ComponentType<FileUploadItemIconProps> = ({
  fileName,
  ...styledProps
}: FileUploadItemIconProps) => {
  const { theme } = useTheme();
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

  if (iconColor.includes('.')) {
    iconColor = getIn(theme.colors, iconColor);
    iconBackgroundColor = getIn(theme.colors, iconBackgroundColor);
  }

  return (
    <BaseBox
      position="relative"
      display="flex"
      flexDirection="column"
      justifyItems="center"
      alignItems="center"
    >
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
