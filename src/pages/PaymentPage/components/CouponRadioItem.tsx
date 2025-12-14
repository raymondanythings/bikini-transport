import { RadioGroup } from '@ark-ui/react';
import type { ComponentPropsWithoutRef } from 'react';
import { css } from 'styled-system/css';
import { HStack, VStack } from 'styled-system/jsx';
import { CheckCircleFilled, CheckCircleOutlined, CircleFilled } from '@/ui-lib/components/Icon';
import { Typography } from '@/ui-lib/components/Typography';

interface CouponRadioItemProps extends ComponentPropsWithoutRef<typeof RadioGroup.Item> {
  discountAmount: string;
  couponName: string;
  conditions: string[];
}

export const CouponRadioItem = ({ discountAmount, couponName, conditions, ...props }: CouponRadioItemProps) => {
  return (
    <RadioGroup.Item className={css({ w: 'full' })} {...props}>
      <RadioGroup.ItemHiddenInput />
      <RadioGroup.ItemControl asChild>
        <HStack
          gap={5}
          p={5}
          width="full"
          justifyContent="space-between"
          borderWidth="1px"
          borderStyle="solid"
          borderRadius="xl"
          cursor="pointer"
          transition="all 0.2s"
          borderColor="line.neutral"
          _checked={{
            borderColor: 'primary.normal',
          }}
        >
          <VStack gap={1} alignItems="start" flex={1}>
            <Typography variant="H0_Bold" color="label.normal">
              {discountAmount}
            </Typography>
            <Typography variant="B1_Medium" color="label.normal">
              {couponName}
            </Typography>
            <VStack gap={1} alignItems="start">
              {conditions.map((condition, index) => (
                <HStack key={index} gap={1.5}>
                  <CircleFilled size={2} />
                  <Typography variant="C1_Medium" color="label.alternative">
                    {condition}
                  </Typography>
                </HStack>
              ))}
            </VStack>
          </VStack>
          <RadioGroup.ItemContext>
            {({ checked }) => (checked ? <CheckCircleFilled size={28} /> : <CheckCircleOutlined size={28} />)}
          </RadioGroup.ItemContext>
        </HStack>
      </RadioGroup.ItemControl>
    </RadioGroup.Item>
  );
};
