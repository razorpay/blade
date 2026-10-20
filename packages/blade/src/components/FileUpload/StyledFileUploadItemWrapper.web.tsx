import styled from 'styled-components';
import type { StyledFileUploadItemWrapperProps } from './types';
import { fileUploadItemColorTokens, fileUploadItemHeightTokens } from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import { makeSize, useTheme } from '~utils';
import { colors as globalColors } from '~tokens/global';
import BaseBox from '~components/Box/BaseBox';

const StyledFileUploadItemWrapper = styled(BaseBox)<StyledFileUploadItemWrapperProps>(
  ({ theme, status, size }) => {
    const { colorScheme } = useTheme();
    const boxShadowColor =
      colorScheme === 'light'
        ? globalColors.neutral.blueGrayLight.a906
        : globalColors.neutral.black[50];

    return {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
      borderStyle: 'solid',
      minHeight: makeSize(fileUploadItemHeightTokens[size]),
      width: '100%',
      backgroundColor: getIn(theme.colors, fileUploadItemColorTokens.background),
      borderColor: getIn(
        theme.colors,
        fileUploadItemColorTokens.border[status === 'error' ? 'error' : 'default'],
      ),
      wordBreak: 'break-all',
      boxShadow: `0px 0.5px 4px 0px ${boxShadowColor}`,
    };
  },
);

export { StyledFileUploadItemWrapper };
