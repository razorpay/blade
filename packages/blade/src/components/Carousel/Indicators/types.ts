type IndicatorsProps = {
  activeIndex: number;
  totalItems: number;
  variant: 'gray' | 'white' | 'blue';
  onIndicatorButtonClick: (index: number) => void;
};

type IndicatorButtonProps = {
  variant: IndicatorsProps['variant'];
  onClick: () => void;
  isActive?: boolean;
  slideIndex?: number;
};

export type { IndicatorsProps, IndicatorButtonProps };
