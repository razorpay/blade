/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import type { SpotlightPopoverStepRenderProps } from './types';
import type { ButtonProps } from '~components/Button';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { MAKE_ANALYTICS_CONSTANTS } from '~utils/makeAnalyticsAttribute';

type SpotlightPopoverFooterAction = {
  text?: string;
} & Pick<ButtonProps, 'variant' | 'icon' | 'iconPosition' | 'isDisabled' | 'isLoading' | 'onClick'>;

type SpotlightPopoverTourFooterProps = {
  actions: {
    primary?: SpotlightPopoverFooterAction;
    secondary?: SpotlightPopoverFooterAction;
  };
};

const SpotlightPopoverTourFooter = ({
  activeStep,
  totalSteps,
  actions,
}: SpotlightPopoverTourFooterProps &
  Pick<SpotlightPopoverStepRenderProps, 'activeStep' | 'totalSteps'>): React.ReactElement => {
  const hasPrimaryAction = Boolean(actions?.primary);
  const hasSecondaryAction = Boolean(actions?.secondary);

  let isBothIcon = false;
  if (hasPrimaryAction && hasSecondaryAction) {
    const primaryHasIcon = Boolean(actions?.primary?.icon);
    const secondaryHasIcon = Boolean(actions?.secondary?.icon);
    isBothIcon = primaryHasIcon && secondaryHasIcon;
  }

  const analyticsStepInfoProps = {
    'data-analytics-active-step': activeStep + 1,
    'data-analytics-total-steps': totalSteps,
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" gap="spacing.7">
      <Text size="small" weight="semibold">
        {activeStep + 1} / {totalSteps}
      </Text>
      <Box display="flex" gap={isBothIcon ? 'spacing.3' : 'spacing.4'}>
        {hasSecondaryAction ? (
          <Button size="small" variant="secondary" {...actions.secondary} data-analytics-name={MAKE_ANALYTICS_CONSTANTS.SPOTLIGHT_POPOVER_TOUR.FOOTER_SECONDARY_ACTION} {...analyticsStepInfoProps}>
            {actions?.secondary!.text!}
          </Button>
        ) : null}
        {hasPrimaryAction ? (
          <Button size="small" variant="primary" {...actions.primary} data-analytics-name={MAKE_ANALYTICS_CONSTANTS.SPOTLIGHT_POPOVER_TOUR.FOOTER_PRIMARY_ACTION} {...analyticsStepInfoProps}>
            {actions?.primary!.text!}
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};

export { SpotlightPopoverTourFooter };
