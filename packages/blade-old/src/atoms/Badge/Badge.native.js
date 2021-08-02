import React from 'react';
import PropTypes from 'prop-types';
import styled, { useTheme } from 'styled-components/native';
import View from '../View';
import Text from '../Text';
import Space from '../Space';
import Size from '../Size';
import Flex from '../Flex';
import { getColor } from '../../_helpers/theme';

const styles = {
  backgroundColor({ variant, fill, theme }) {
    switch (variant) {
      case 'positive':
        if (fill === 'subtle') {
          return getColor(theme, 'positive.930');
        }
        return getColor(theme, 'positive.900');
      case 'negative':
        if (fill === 'subtle') {
          return getColor(theme, 'negative.930');
        }
        return getColor(theme, 'negative.900');
      case 'information':
        if (fill === 'subtle') {
          return getColor(theme, 'shade.930');
        }
        return getColor(theme, 'shade.900');
      case 'warning':
        if (fill === 'subtle') {
          return getColor(theme, 'neutral.930');
        }
        return getColor(theme, 'neutral.900');
      case 'neutral':
        if (fill === 'subtle') {
          return getColor(theme, 'primary.930');
        }
        return getColor(theme, 'primary.900');
      default:
        if (fill === 'subtle') {
          return variant ? getColor(theme, variant) : getColor(theme, 'positive.930');
        }
        return variant ? getColor(theme, variant) : getColor(theme, 'positive.900');
    }
  },
  borderRadius({ shape, theme }) {
    if (shape === 'stadium') {
      return `${parseInt(theme.spacings.xlarge, 10) / 2}px`;
    }
    return theme.spacings.xxsmall;
  },
  fontColor({ variant, fill }) {
    if (fill === 'subtle') {
      switch (variant) {
        case 'positive':
          return 'positive.900';
        case 'negative':
          return 'negative.900';
        case 'information':
          return 'shade.980';
        case 'warning':
          return 'neutral.900';
        case 'neutral':
          return 'primary.900';
        default:
      }
    }
    return 'light.900';
  },
  padding({ shape, theme }) {
    if (shape === 'stadium') {
      return [0, theme.spacings.medium];
    }
    return [0, theme.spacings.xsmall];
  },
  height({ shape, theme }) {
    if (shape === 'stadium') {
      return theme.spacings.xlarge;
    }
    return theme.spacings.large;
  },
};

const StyledBadge = styled(View)`
  background-color: ${styles.backgroundColor};
  border-radius: ${styles.borderRadius};
`;

const Badge = ({ children, variant, fill, shape }) => {
  const theme = useTheme();

  if (typeof children !== 'string') {
    throw new Error(
      `Error in Badge: expected \`children\` of type \`string\` but found ${typeof children}`,
    );
  }

  return (
    <Flex alignItems="center" justifyContent="center" alignSelf="flex-start">
      <Size
        height={styles.height({
          shape,
          theme,
        })}
      >
        <Space
          padding={styles.padding({
            shape,
            theme,
          })}
        >
          <StyledBadge variant={variant} fill={fill} shape={shape}>
            {children && (
              <Text
                size="xxsmall"
                color={styles.fontColor({
                  variant,
                  fill,
                })}
                weight="bold"
                _letterSpacing="medium"
              >
                {children.toUpperCase()}
              </Text>
            )}
          </StyledBadge>
        </Space>
      </Size>
    </Flex>
  );
};

Badge.propTypes = {
  children: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['positive', 'negative', 'information', 'warning', 'neutral']),
  fill: PropTypes.oneOf(['subtle', 'solid']),
  shape: PropTypes.oneOf(['stadium', 'rectangle']),
};

Badge.defaultProps = {
  variant: 'neutral',
  fill: 'subtle',
  shape: 'stadium',
};

export default Badge;
