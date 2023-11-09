/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import type { StepRenderProps } from './types';
import type { ButtonProps } from '~components/Button';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

type TourFooterAction = {
  text?: string;
} & Pick<ButtonProps, 'variant' | 'icon' | 'iconPosition' | 'isDisabled' | 'isLoading' | 'onClick'>;

type TourFooterProps = {
  actions: {
    primary?: TourFooterAction;
    secondary?: TourFooterAction;
  };
};

const TourFooter = ({
  activeStep,
  totalSteps,
  actions,
}: TourFooterProps & Pick<StepRenderProps, 'activeStep' | 'totalSteps'>): React.ReactElement => {
  const hasPrimaryAction = Boolean(actions?.primary);
  const hasSecondaryAction = Boolean(actions?.secondary);

  let isBothIcon = false;
  if (hasPrimaryAction && hasSecondaryAction) {
    const primaryHasIcon = Boolean(actions?.primary?.icon);
    const secondaryHasIcon = Boolean(actions?.secondary?.icon);
    isBothIcon = primaryHasIcon && secondaryHasIcon;
  }

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" gap="spacing.7">
      <Text size="small" weight="bold">
        {activeStep + 1} / {totalSteps}
      </Text>
      <Box display="flex" gap={isBothIcon ? 'spacing.3' : 'spacing.4'}>
        {hasSecondaryAction ? (
          <Button size="small" variant="secondary" {...actions.secondary}>
            {actions?.secondary!.text!}
          </Button>
        ) : null}
        {hasPrimaryAction ? (
          <Button size="small" variant="primary" {...actions.primary}>
            {actions?.primary!.text!}
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};

export { TourFooter };
