const CAROUSEL_AUTOPLAY_INTERVAL = 6000;
/*
 Button have width of 34px in desktop , value from left /right should be 34px/2 = 17px.
 In mobile we have 24px width of button , value from left /right should be 24px/2 = 12px. (but currently we don't support overlap in mobile)
*/
const CAROUSEL_OVERLAP_VALUE_OFFSET = '-17px';

const componentIds = {
  CarouselItem: 'CarouselItem',
};

export { CAROUSEL_AUTOPLAY_INTERVAL, componentIds, CAROUSEL_OVERLAP_VALUE_OFFSET };
