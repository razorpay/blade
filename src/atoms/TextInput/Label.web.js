import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { getColor } from '../../_helpers/theme';
import View from '../View';
import Space from '../Space';
import Text from '../Text';

const styles = {
  container: {
    height({ variant }) {
      if (variant === 'outlined') {
        return '10px';
      } else {
        return '20px';
      }
    },
  },
  text: {
    color({ theme, isFocused, hasError, disabled, variant }) {
      if (variant === 'outlined') {
        if (isFocused && !hasError) {
          return getColor(theme, 'primary.800');
        }
      }
      if (disabled) {
        return getColor(theme, 'shade.940');
      }
      return getColor(theme, 'shade.980');
    },
    fontSize({ theme }) {
      return theme.fonts.size.xsmall;
    },
    lineHeight({ theme }) {
      return theme.fonts.lineHeight.small;
    },
    fontFamily({ theme }) {
      return theme.fonts.family.lato.regular;
    },
  },
  label: {
    padding({ iconLeft, prefix, position, variant, isFocused }) {
      if (variant !== 'filled' && (iconLeft || prefix) && !isFocused) {
        return '0 0 0 25px';
      } else if (position === 'left') {
        return '14px';
      }
      return '0';
    },
    top({ isFocused, variant }) {
      if (isFocused || variant === 'filled') {
        return '-10px';
      }
      return '14px';
    },
  },
};

const FloatView = styled(View)`
  position: absolute;
`;

const StyledText = styled(Text)`
  font-family: ${styles.text.fontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: ${styles.text.fontSize};
  line-height: ${styles.text.lineHeight};
  color: ${styles.text.color};
  top: ${styles.label.top};
  transition: top 100ms linear;
`;

const Label = ({
  children,
  position,
  disabled,
  iconLeft,
  prefix,
  animated,
  isFocused,
  hasError,
  variant,
}) => {
  return (
    <Space
      padding={styles.label.padding({
        position,
        isFocused,
        iconLeft,
        prefix,
        variant,
      })}
    >
      {animated ? (
        <FloatView>
          <StyledText
            as="label"
            for={children}
            size="medium"
            isFocused={isFocused}
            hasError={hasError}
            disabled={disabled}
            variant={variant}
          >
            {children}
          </StyledText>
        </FloatView>
      ) : (
        <StyledText
          as="label"
          size="medium"
          hasError={hasError}
          disabled={disabled}
          variant={variant}
        >
          {children}
        </StyledText>
      )}
    </Space>
  );
};

Label.propTypes = {
  children: PropTypes.string,
  position: PropTypes.oneOf(['top', 'left']).isRequired,
  disabled: PropTypes.bool,
  animated: PropTypes.bool,
  isFocused: PropTypes.bool,
  variant: PropTypes.oneOf(['outlined', 'filled']).isRequired,
  iconLeft: PropTypes.bool,
  prefix: PropTypes.bool,
  hasError: PropTypes.bool,
};

Label.defaultProps = {
  children: 'Label',
  disabled: false,
  animated: false,
};

export default Label;
