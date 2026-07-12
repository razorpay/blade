import React from 'react';
import { CardBody } from './Card';
import type { CardProps } from './Card';
import { CardProvider } from './CardContext';
import { LinkOverlay } from './LinkOverlay';
import { CardRoot } from './CardRoot';
import { CardTicketSurface } from './CardTicketSurface';
import { createSectionedCardSlot } from './createSectionedCardSlot';
import { SectionedCardComponentIds } from './sectionedCardConstants';
import { splitSectionedCardChildren } from './splitSectionedCardChildren';
import { useSectionedCardState } from './useSectionedCardState';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import type { BladeElementRef } from '~utils/types';
import { isReactNative } from '~utils';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren/useVerifyAllowedChildren';

export type TicketCardProps = Omit<CardProps, 'variant'>;

const TicketCardBody = createSectionedCardSlot(
  SectionedCardComponentIds.TicketCardBody,
  MetaConstants.TicketCardBody,
);

const TicketCardFooter = createSectionedCardSlot(
  SectionedCardComponentIds.TicketCardFooter,
  MetaConstants.TicketCardFooter,
);

const _TicketCard: React.ForwardRefRenderFunction<BladeElementRef, TicketCardProps> = (
  {
    children,
    testID,
    width,
    height,
    minHeight,
    minWidth,
    maxWidth,
    onClick,
    isSelected = false,
    isDisabled = false,
    accessibilityLabel,
    onHover,
    href,
    target,
    rel,
    as,
    size = 'large',
    cursor,
    opacity,
    transition,
    flexShrink,
    ...rest
  },
  ref,
): React.ReactElement => {
  useVerifyAllowedChildren({
    children,
    componentName: 'TicketCard',
    allowedComponents: [
      SectionedCardComponentIds.TicketCardBody,
      SectionedCardComponentIds.TicketCardFooter,
    ],
  });

  const { body, footer } = splitSectionedCardChildren({
    children,
    bodyComponentId: SectionedCardComponentIds.TicketCardBody,
    footerComponentId: SectionedCardComponentIds.TicketCardFooter,
    componentName: 'TicketCard',
  });

  const {
    isFocused,
    isCardDisabled,
    isCardSelected,
    linkOverlayProps,
    defaultRel,
  } = useSectionedCardState({
    isSelected,
    isDisabled,
    accessibilityLabel,
    href,
    target,
    onClick,
  });

  return (
    <CardProvider size={size}>
      <CardRoot
        as={as}
        ref={ref as never}
        display={'block' as never}
        onMouseEnter={onHover as never}
        isSelected={false}
        isFocused={isFocused}
        onClick={isReactNative() && !isCardDisabled ? onClick : undefined}
        width={width}
        height={height}
        minHeight={minHeight}
        minWidth={minWidth}
        maxWidth={maxWidth}
        href={isCardDisabled ? undefined : href}
        accessibilityLabel={accessibilityLabel}
        cursor={(isReactNative() ? undefined : isCardDisabled ? 'not-allowed' : cursor) as never}
        opacity={opacity}
        transition={transition}
        flexShrink={flexShrink}
        {...makeAccessible({ disabled: isCardDisabled ? true : undefined })}
        {...metaAttribute({ name: MetaConstants.Card, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
      >
        <CardTicketSurface
          top={<CardBody>{body}</CardBody>}
          bottom={<CardBody>{footer}</CardBody>}
          tearLine={null}
          isSelected={isCardSelected}
          isDisabled={isCardDisabled}
        >
          {!isCardDisabled && href ? (
            <LinkOverlay
              onClick={onClick}
              href={href}
              target={target}
              rel={rel ?? defaultRel}
              {...linkOverlayProps}
            />
          ) : null}
          {!isCardDisabled && !href && onClick ? (
            <LinkOverlay as="button" onClick={onClick} {...linkOverlayProps} />
          ) : null}
        </CardTicketSurface>
      </CardRoot>
    </CardProvider>
  );
};

const TicketCard = React.forwardRef(_TicketCard);

export { TicketCard, TicketCardBody, TicketCardFooter };
