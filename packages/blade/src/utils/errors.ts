import { componentIds as modalDrawerIds } from '~components/Modal/constants';
import { componentIds as carouselIds } from '~components/Carousel/constants';
import { drawerComponentIds } from '~components/Drawer/drawerComponentIds';
import { ComponentIds as cardComponentIds } from '~components/Card/constants';

const propValidations = {
  Card: {
    CANNOT_BE_USED_OUTSIDE: `{componentName} cannot be used outside of Card component`,
  },
  Accordion: {
    SHOW_NUMBER_PREFIX_AND_ICON: `showNumberPrefix and icon shouldn't be used together`,
    ACCORDION_ITEM_COMPONENTS_SHOULD_BE_ONLY_USED_WITHIN_ACCORDION_ITEM: `AccordionItem* components should be only used within AccordionItem`,
    ACCORDION_ITEM_ONLY_ALLOWS_ACCORDION_ITEM_HEADER_AND_BODY: `AccordionItem only allows AccordionItemHeader as first component and AccordionItemBody as second. Check Accordion documentation`,
  },
} as const;

const childrenValidations = {
  ButtonGroup: {
    allowedComponents: ['Button', 'Dropdown', 'Tooltip', 'Popover'],
    componentName: 'ButtonGroup',
  },
  Card: {
    componentName: 'Card',
    allowedComponents: [
      cardComponentIds.CardHeader,
      cardComponentIds.CardBody,
      cardComponentIds.CardFooter,
    ],
  },
  CardFooter: {
    componentName: 'CardFooter',
    allowedComponents: [cardComponentIds.CardFooterLeading, cardComponentIds.CardFooterTrailing],
  },
  CardHeader: {
    componentName: 'CardHeader',
    allowedComponents: [cardComponentIds.CardHeaderLeading, cardComponentIds.CardHeaderTrailing],
  },
  Carousel: {
    componentName: 'Carousel',
    allowedComponents: [carouselIds.CarouselItem],
  },
  Modal: {
    componentName: 'Modal',
    allowedComponents: [
      modalDrawerIds.ModalHeader,
      modalDrawerIds.ModalBody,
      modalDrawerIds.ModalFooter,
    ],
  },
  Drawer: {
    componentName: 'Drawer',
    allowedComponents: [drawerComponentIds.DrawerHeader, drawerComponentIds.DrawerBody],
  },
};

export { propValidations, childrenValidations };
