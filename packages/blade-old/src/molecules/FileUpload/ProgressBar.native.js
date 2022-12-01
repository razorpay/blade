import React, { useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import View from '../../atoms/View';
import Position from '../../atoms/Position';
import { getColor, getColorKeys } from '../../_helpers/theme';
import Size from '../../atoms/Size';

const styles = {
  height({ size }) {
    switch (size) {
      case 'large':
        return '12px';
      case 'medium':
        return '8px';
      case 'small':
        return '4px';
      default:
        return '8px';
    }
  },
  progressColor({ error, color }) {
    return error ? 'negative.960' : color;
  },
};

const ProgressContainer = styled(View)`
  border-radius: 100px;
  background-color: ${(props) => props.theme.bladeOld.colors.background[800]};
`;

const StyledProgressBar = styled(Animated.View)`
  background-color: ${(props) => getColor(props.theme, props.color)};
  border-radius: 100px;
`;

const ProgressBar = ({ progress, error, size, color }) => {
  const animation = useRef(new Animated.Value(progress));

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      duration: 300,
    }).start();
  }, [progress]);

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <Size
      width="100%"
      maxWidth="100%"
      height={styles.height({
        size,
      })}
    >
      <ProgressContainer>
        <Position position="absolute" top={0} bottom={0} left={0} right={0}>
          <Size
            maxWidth="100%"
            height={styles.height({
              size,
            })}
          >
            <StyledProgressBar
              error={error}
              style={{
                width,
              }}
              color={styles.progressColor({
                error,
                color,
              })}
            />
          </Size>
        </Position>
      </ProgressContainer>
    </Size>
  );
};

ProgressBar.propTypes = {
  color: PropTypes.oneOf(getColorKeys()),
  error: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  progress: PropTypes.number,
};

ProgressBar.defaultProps = {
  size: 'medium',
  color: 'positive.960',
};

export default ProgressBar;
