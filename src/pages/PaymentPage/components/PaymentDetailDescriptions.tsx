import type { ComponentProps } from 'react';
import { type BoxProps, Flex, HStack, type HstackProps } from 'styled-system/jsx';
import { Accordion } from '@/ui-lib/components/Accordion';
import { DownOutlined } from '@/ui-lib/components/Icon';
import { Typography } from '@/ui-lib/components/Typography';

const PaymentDetailDescriptionsRoot = ({ children, ...props }: Omit<BoxProps, 'direction' | 'gap'>) => {
  return (
    <Flex direction="column" gap="4" {...props}>
      {children}
    </Flex>
  );
};

const PaymentDetailDescriptionsItem = ({
  label,
  children,
  containerStyle,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  containerStyle?: HstackProps;
}) => {
  return (
    <HStack gap="5" {...containerStyle}>
      <Typography variant="B1_Bold" color="label.normal">
        {label}
      </Typography>
      {children}
    </HStack>
  );
};

const PaymentDetailDescriptionsExpandableItem = ({
  content,
  ...itemProps
}: ComponentProps<typeof PaymentDetailDescriptionsItem> & {
  content: React.ReactNode;
}) => {
  return (
    <Accordion
      items={[
        {
          key: 'item',
          label: <PaymentDetailDescriptionsItem {...itemProps} />,
          children: content,
          indicator: <DownOutlined size={16} />,
        },
      ]}
    />
  );
};

export const PaymentDetailDescriptions = {
  Root: PaymentDetailDescriptionsRoot,
  Item: PaymentDetailDescriptionsItem,
  ExpandableItem: PaymentDetailDescriptionsExpandableItem,
};
