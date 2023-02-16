import styled from 'styled-components';
import { ComponentIds } from './componentIds';
import { Divider } from './Divider';
import BaseBox from '~components/Box/BaseBox';
import { IconButton } from '~components/Button/IconButton';
import type { IconComponent } from '~components/Icons';
import { CloseIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import type { WithComponentId } from '~utils';
import { makeSpace } from '~utils';

type BottomSheetHeaderLeadingProps = {
  title: string;
  prefix: React.ReactNode;
};

const BottomSheetHeaderLeading: WithComponentId<BottomSheetHeaderLeadingProps> = ({
  title,
  prefix,
}) => {
  return (
    <BaseBox flex={1} display="flex" flexDirection="row" alignItems="center">
      <BaseBox marginRight="spacing.4" alignSelf="center" display="flex">
        {prefix}
      </BaseBox>
      <BaseBox>
        <Text variant="body" weight="bold" type="normal" contrast="low">
          {title}
        </Text>
      </BaseBox>
    </BaseBox>
  );
};
BottomSheetHeaderLeading.componentId = ComponentIds.BottomSheetHeaderLeading;

type BottomSheetHeaderTrailingProps = {
  visual: React.ReactNode;
};

const BottomSheetHeaderTrailing: WithComponentId<BottomSheetHeaderTrailingProps> = ({ visual }) => {
  return (
    <BaseBox display="flex" flexDirection="row" alignItems="center">
      <BaseBox marginRight="spacing.4" alignSelf="center" display="flex">
        {visual}
      </BaseBox>
      <BaseBox>
        <IconButton
          onClick={() => {
            console.log(1);
          }}
          icon={CloseIcon}
          accessibilityLabel="Close BottomSheet"
        />
      </BaseBox>
    </BaseBox>
  );
};
BottomSheetHeaderTrailing.componentId = ComponentIds.BottomSheetHeaderTrailing;

type BottomSheetHeaderProps = {
  children?: React.ReactNode;
};

const BottomSheetHeader: WithComponentId<BottomSheetHeaderProps> = ({
  children,
}): React.ReactElement => {
  return (
    <BaseBox>
      <BaseBox
        overflow="auto"
        marginTop="spacing.5"
        marginBottom="spacing.5"
        paddingLeft="spacing.6"
        paddingRight="spacing.6"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        {children}
      </BaseBox>
      <Divider />
    </BaseBox>
  );
};
BottomSheetHeader.componentId = ComponentIds.BottomSheetHeader;

const BottomSheetGrabHandle = styled.div(({ theme }) => {
  return {
    backgroundColor: theme.colors.brand.gray.a100.lowContrast,
    // TODO: we do not have 16px radius token
    borderRadius: makeSpace(theme.spacing[5]),
    // TODO: refactor to size tokens
    width: makeSpace(60),
    height: makeSpace(4),
    margin: 'auto',
    marginTop: makeSpace(theme.spacing[5]),
  };
});

export {
  BottomSheetGrabHandle,
  BottomSheetHeader,
  BottomSheetHeaderLeading,
  BottomSheetHeaderLeadingProps,
  BottomSheetHeaderProps,
  BottomSheetHeaderTrailing,
  BottomSheetHeaderTrailingProps,
};
