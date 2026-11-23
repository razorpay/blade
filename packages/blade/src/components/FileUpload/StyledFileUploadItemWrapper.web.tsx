import styled from 'styled-components';
import type { StyledFileUploadItemWrapperProps } from './types';
import {
  fileUploadItemColorTokens,
  fileUploadItemCompactTokens,
  fileUploadItemHeightTokens,
  fileUploadMotionTokens,
} from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import { makeMotionTime, makeSize, useTheme } from '~utils';
import { colors as globalColors } from '~tokens/global';
import BaseBox from '~components/Box/BaseBox';

const StyledFileUploadItemWrapper = styled(BaseBox)<StyledFileUploadItemWrapperProps>(
  ({ theme, status, size, isCompact }) => {
    const { colorScheme } = useTheme();
    const boxShadowColor =
      colorScheme === 'light'
        ? globalColors.neutral.blueGrayLight.a906
        : globalColors.neutral.black[50];
    const errorOrDefault = status === 'error' ? 'error' : 'default';

    if (isCompact) {
      return {
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderStyle: 'solid',
        minHeight: makeSize(fileUploadItemCompactTokens.height),
        backgroundColor: getIn(theme.colors, fileUploadItemCompactTokens.background.default),
        borderColor: getIn(theme.colors, fileUploadItemCompactTokens.border[errorOrDefault]),
        transitionProperty: 'background-color',
        transitionDuration: makeMotionTime(getIn(theme.motion, fileUploadMotionTokens.duration)),
        transitionTimingFunction: getIn(theme.motion, fileUploadMotionTokens.easing),
        '&:hover': {
          backgroundColor: getIn(theme.colors, fileUploadItemCompactTokens.background.hover),
        },
      };
    }

    return {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
      borderStyle: 'solid',
      minHeight: makeSize(fileUploadItemHeightTokens[size]),
      width: '100%',
      backgroundColor: getIn(theme.colors, fileUploadItemColorTokens.background),
      borderColor: getIn(theme.colors, fileUploadItemColorTokens.border[errorOrDefault]),
      wordBreak: 'break-all',
      boxShadow: `0px 0.5px 4px 0px ${boxShadowColor}`,
    };
  },
);

export { StyledFileUploadItemWrapper };
