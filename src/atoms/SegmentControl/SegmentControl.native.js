import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import SegmentControlContext from './SegmentControlContext';
import SegmentControlOption from './SegmentControlOption';
import styled from 'styled-components/native';
import View from '../View';
import Flex from '../Flex';
import { getColor } from '../../_helpers/theme';

const styles = {
  container: {
    border({ theme, variant }) {
      if (variant === 'outlined') {
        return `1px ${getColor(theme, 'shade.920')}`;
      }
      return '0px';
    },
    borderRadius() {
      return '2px';
    },
    minHeight({ size }) {
      if (size === 'small') {
        return '36px';
      }
      return '40px';
    },
  },
};

const SegmentOptionsContainer = styled(View)`
  border: ${styles.container.border};
  border-radius: ${styles.container.borderRadius};
  overflow: hidden;
  min-height: ${styles.container.minHeight};
`;

const SegmentControl = ({ value, onChange, defaultValue, variant, children, size }) => {
  const [selected, setSelected] = useState(value || defaultValue);

  const onValueChange = useCallback(
    (newValue) => {
      if (!value) {
        setSelected(newValue);
      }
      if (onChange) onChange(newValue);
    },
    [onChange, value],
  );

  const contextValue = useMemo(
    () => ({ value: selected, onChange: onValueChange, variant, size }),
    [onValueChange, selected, variant, size],
  );

  return (
    <SegmentControlContext.Provider value={contextValue}>
      <Flex flexDirection="row">
        <SegmentOptionsContainer variant={variant} size={size}>
          {variant === 'filled'
            ? children.map((child, index) => {
                const hideDivider =
                  index === children.length - 1 ||
                  (children[index + 1] && selected === children[index + 1].props.value) ||
                  selected === child.props.value;

                return React.cloneElement(child, { ...child.props, key: `${index}`, hideDivider });
              })
            : children}
        </SegmentOptionsContainer>
      </Flex>
    </SegmentControlContext.Provider>
  );
};

SegmentControl.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['outlined', 'filled']),
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium']),
};

SegmentControl.defaultProps = {
  value: undefined,
  defaultValue: undefined,
  onChange: () => {},
  variant: 'outlined',
  size: 'medium',
};

SegmentControl.Option = SegmentControlOption;

export default SegmentControl;
