import type { IconComponent } from '~components/Icons';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type SegmentedControlSize = 'medium' | 'large';

type SegmentedControlCommonProps = {
  children: React.ReactNode;
  labelPosition?: 'top' | 'left';
  value?: string;
  defaultValue?: string;
  onChange?: ({ name, value }: { name: string; value: string }) => void;
  name?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  size?: SegmentedControlSize;
  isFullWidth?: boolean;
  validationState?: 'none' | 'error' | 'success';
  helpText?: string;
  errorText?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

type SegmentedControlPropsWithLabel = SegmentedControlCommonProps & {
  label: string;
  accessibilityLabel?: undefined;
};

type SegmentedControlPropsWithA11yLabel = SegmentedControlCommonProps & {
  label?: undefined;
  accessibilityLabel: string;
};

type SegmentedControlProps = SegmentedControlPropsWithLabel | SegmentedControlPropsWithA11yLabel;

type SegmentedControlItemProps = {
  value: string;
  label: string;
  icon?: IconComponent;
  isDisabled?: boolean;
} & TestID &
  DataAnalyticsAttribute;

type SegmentedControlContextType = {
  size?: SegmentedControlSize;
  isDisabled?: boolean;
  name?: string;
  selectedValue?: string;
  setSelectedValue?: (value: string) => void;
  baseId?: string;
};

export type {
  SegmentedControlProps,
  SegmentedControlItemProps,
  SegmentedControlContextType,
  SegmentedControlSize,
};
