import type { BladeFile } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Svg, Path } from '~components/Icons/_Svg';
import { Text } from '~components/Typography';
import { useTheme } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import { colors as globalColors } from '~tokens/global';

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
          fill={getIn(theme.colors, 'interactive.icon.negative.disabled')}
        />
      </Svg>
    );
  }

  const FILE_EXTENSION_REGEX = /(?:\.([^.]+))?$/i;
  const [fileExtension, fileType] = FILE_EXTENSION_REGEX.exec(fileName) ?? [];

  const iconColors: Record<'background' | 'border' | 'cover' | 'fold', string> = {
    background: globalColors.chromatic.cloud[50],
    border: globalColors.chromatic.cloud[600],
    cover: globalColors.chromatic.cloud[700],
    fold: globalColors.chromatic.cloud[800],
  };

  switch (fileType) {
    case 'pdf':
      iconColors.background = globalColors.chromatic.crimson[50];
      iconColors.border = globalColors.chromatic.crimson[600];
      iconColors.cover = globalColors.chromatic.crimson[700];
      iconColors.fold = globalColors.chromatic.crimson[800];
      break;
    case 'doc':
    case 'docx':
      iconColors.background = globalColors.chromatic.azure[50];
      iconColors.border = globalColors.chromatic.azure[600];
      iconColors.cover = globalColors.chromatic.azure[700];
      iconColors.fold = globalColors.chromatic.azure[800];
      break;
    case 'xls':
    case 'xlsx':
    case 'csv':
      iconColors.background = globalColors.chromatic.emerald[50];
      iconColors.border = globalColors.chromatic.emerald[600];
      iconColors.cover = globalColors.chromatic.emerald[700];
      iconColors.fold = globalColors.chromatic.emerald[800];
      break;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      iconColors.background = globalColors.chromatic.sapphire[50];
      iconColors.border = globalColors.chromatic.sapphire[600];
      iconColors.cover = globalColors.chromatic.sapphire[700];
      iconColors.fold = globalColors.chromatic.sapphire[800];
      break;
    default:
      iconColors.background = globalColors.chromatic.cloud[50];
      iconColors.border = globalColors.chromatic.cloud[600];
      iconColors.cover = globalColors.chromatic.cloud[700];
      iconColors.fold = globalColors.chromatic.cloud[800];
  }

  return (
    <BaseBox display="flex" position="relative" justifyContent="center">
      <Svg {...styledProps} width="38" height="39" viewBox="0 0 38 39" fill="none">
        <Path d="M5.5 31.5801H3L5.5 34.0801V31.5801Z" fill={iconColors.fold} />
        <Path d="M32.7998 31.5801H35.2998L32.7998 34.0801V31.5801Z" fill={iconColors.fold} />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.35552 2.71162C6.91384 2.09227 7.66518 1.75 8.44238 1.75H25.9153L32.832 9.42294V33.5872C32.832 34.4743 32.514 35.3206 31.955 35.9408C31.3966 36.5601 30.6453 36.9024 29.8681 36.9024H8.44238C7.66518 36.9024 6.91384 36.5601 6.35552 35.9408C5.79644 35.3206 5.47852 34.4743 5.47852 33.5872V5.06524C5.47852 4.17809 5.79644 3.33184 6.35552 2.71162Z"
          fill={iconColors.background}
          stroke={iconColors.border}
        />

        <Path d="M3 19.3262H35.31V31.5817H3V19.3262Z" fill={iconColors.cover} strokeWidth="0.5" />
      </Svg>
      <Text position="absolute" top="46%" color="interactive.text.staticWhite.normal" size="xsmall">
        {fileExtension}
      </Text>
    </BaseBox>
  );
};

export { FileUploadItemIcon };
