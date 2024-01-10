const getCarouselItemId = (containerId: string, index: number): string => {
  return `#${containerId}-carousel-item-${index}`;
};

export { getCarouselItemId };
